"""Tests for /api/mandi/prices. data.gov.in is never called: _fetch_records is replaced.

Requests go straight into the ASGI app (no TestClient, which needs an extra HTTP client package).
Run: python -m pytest tests/test_mandi.py --noconftest
"""
import asyncio
import json
import urllib.error
import urllib.parse

import pytest

from app.main import app
from app.routers import mandi


class Response:
    def __init__(self, status_code, body):
        self.status_code = status_code
        self.text = body.decode()

    def json(self):
        return json.loads(self.text)


class AsgiClient:
    """Just enough of a client for GET requests."""

    def __init__(self, asgi_app):
        self.app = asgi_app

    def get(self, path, params=None):
        return asyncio.run(self._get(path, params or {}))

    async def _get(self, path, params):
        scope = {
            "type": "http", "asgi": {"version": "3.0"}, "http_version": "1.1", "method": "GET",
            "scheme": "http", "path": path, "raw_path": path.encode(), "root_path": "",
            "query_string": urllib.parse.urlencode(params).encode(),
            "headers": [(b"host", b"test")], "client": ("127.0.0.1", 1234), "server": ("test", 80),
        }
        sent = []

        async def receive():
            return {"type": "http.request", "body": b"", "more_body": False}

        async def send(message):
            sent.append(message)

        await self.app(scope, receive, send)
        status = next(m["status"] for m in sent if m["type"] == "http.response.start")
        body = b"".join(m.get("body", b"") for m in sent if m["type"] == "http.response.body")
        return Response(status, body)

RECORDS = [
    {"state": "Maharashtra", "district": "Satara", "market": "Phaltan", "commodity": "Onion",
     "variety": "Red", "grade": "FAQ", "arrival_date": "03/11/2026",
     "min_price": "1200", "max_price": "2400", "modal_price": "1900"},
    {"state": "Maharashtra", "district": "Pune", "market": "Baramati", "commodity": "Onion",
     "variety": "Red", "grade": "FAQ", "arrival_date": "04/11/2026",
     "min_price": "", "max_price": "0", "modal_price": "2100"},
    # malformed rows are skipped
    {"market": "Lonand", "arrival_date": "04/11/2026", "modal_price": "NR"},
    {"market": "", "arrival_date": "04/11/2026", "modal_price": "1500"},
    {"market": "Satara", "arrival_date": "31/02/2026", "modal_price": "1500"},
]


@pytest.fixture
def api(monkeypatch):
    mandi._cache.clear()
    monkeypatch.setenv("DATA_GOV_IN_API_KEY", "test-key")
    calls = []

    def fake_fetch(key, filters):
        calls.append(filters)
        return RECORDS

    monkeypatch.setattr(mandi, "_fetch_records", fake_fetch)
    yield AsgiClient(app), calls
    mandi._cache.clear()


def test_no_key_is_503_not_a_crash(monkeypatch):
    monkeypatch.delenv("DATA_GOV_IN_API_KEY", raising=False)
    monkeypatch.delenv("AGMARKNET_API_KEY", raising=False)
    res = AsgiClient(app).get("/api/mandi/prices", params={"commodity": "Onion"})
    assert res.status_code == 503


def test_normalises_and_sorts_newest_first(api):
    client, calls = api
    res = client.get("/api/mandi/prices", params={"commodity": "Onion"})
    assert res.status_code == 200
    body = res.json()
    assert body["source"] == "live"
    assert body["count"] == 2
    first, second = body["records"]
    assert first["market"] == "Baramati" and first["arrival_date"] == "2026-11-04"
    # missing min/max fall back to the modal price
    assert first["price_min"] == first["price_max"] == 2100
    assert second["arrival_date"] == "2026-11-03" and second["price_min"] == 1200
    assert calls == [{"commodity": "Onion", "state": "Maharashtra"}]


def test_date_is_sent_in_dataset_format(api):
    client, calls = api
    res = client.get("/api/mandi/prices", params={"commodity": "Onion", "date": "2026-11-04", "district": " Satara "})
    assert res.status_code == 200
    assert calls[0]["arrival_date"] == "04/11/2026"
    assert calls[0]["district"] == "Satara"


def test_bad_date_is_400(api):
    client, _ = api
    assert client.get("/api/mandi/prices", params={"commodity": "Onion", "date": "4-11-26"}).status_code == 400


def test_second_call_comes_from_cache(api):
    client, calls = api
    client.get("/api/mandi/prices", params={"commodity": "Onion"})
    res = client.get("/api/mandi/prices", params={"commodity": "onion"})
    assert res.json()["source"] == "cache"
    assert len(calls) == 1


def test_upstream_failure_is_502_without_leaking_key(api, monkeypatch):
    client, _ = api

    def boom(key, filters):
        raise urllib.error.URLError(f"failed for api-key={key}")

    monkeypatch.setattr(mandi, "_fetch_records", boom)
    res = client.get("/api/mandi/prices", params={"commodity": "Onion"})
    assert res.status_code == 502
    assert "test-key" not in res.text


def test_no_rows_is_404(api, monkeypatch):
    client, _ = api
    monkeypatch.setattr(mandi, "_fetch_records", lambda key, filters: [])
    assert client.get("/api/mandi/prices", params={"commodity": "Onion"}).status_code == 404


def test_api_key_still_required_when_configured(api, monkeypatch):
    from app.config import settings

    client, _ = api
    monkeypatch.setattr(settings, "api_key", "secret")
    assert client.get("/api/mandi/prices", params={"commodity": "Onion"}).status_code == 401
