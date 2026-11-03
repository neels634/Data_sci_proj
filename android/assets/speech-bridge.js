// Android's WebView has no speechSynthesis or SpeechRecognition, so the app's voice buttons would do
// nothing. This gives the page the same browser APIs, backed by the phone's own speech services
// through the AndroidVoice bridge in MainActivity. The web app itself doesn't change.
(function () {
  if (window.__androidVoiceReady || !window.AndroidVoice) return;
  window.__androidVoiceReady = true;
  var native = window.AndroidVoice;

  function fire(target, type, detail) {
    var event = Object.assign({ type: type, target: target }, detail || {});
    var handler = target["on" + type];
    if (typeof handler === "function") handler.call(target, event);
    (target.__listeners && target.__listeners[type] ? target.__listeners[type].slice() : []).forEach(function (l) {
      l.call(target, event);
    });
  }
  function listenable(target) {
    target.__listeners = {};
    target.addEventListener = function (type, l) {
      (target.__listeners[type] = target.__listeners[type] || []).push(l);
    };
    target.removeEventListener = function (type, l) {
      target.__listeners[type] = (target.__listeners[type] || []).filter(function (x) {
        return x !== l;
      });
    };
    return target;
  }

  // ---- speaking

  function Utterance(text) {
    listenable(this);
    this.text = text || "";
    this.lang = "";
    this.voice = null;
    this.rate = 1;
    this.pitch = 1;
    this.volume = 1;
  }

  var nextId = 1;
  var queued = {};
  var synth = listenable({
    speaking: false,
    pending: false,
    paused: false,
    getVoices: function () {
      try {
        return JSON.parse(native.voices()).map(function (v) {
          return { name: v.name, lang: v.lang, voiceURI: v.name, localService: true, default: false };
        });
      } catch (e) {
        return [];
      }
    },
    speak: function (u) {
      var id = "u" + nextId++;
      queued[id] = u;
      synth.pending = true;
      native.speak(id, u.text, (u.voice && u.voice.lang) || u.lang || "en-IN", u.rate || 1);
    },
    cancel: function () {
      var waiting = queued;
      queued = {};
      synth.speaking = synth.pending = false;
      native.stopSpeaking();
      Object.keys(waiting).forEach(function (id) {
        fire(waiting[id], "error", { error: "canceled" });
      });
    },
    pause: function () {},
    resume: function () {},
  });

  window.__androidTts = function (id, type) {
    if (type === "voiceschanged") return fire(synth, "voiceschanged");
    var u = queued[id];
    if (!u) return;
    if (type === "start") {
      synth.speaking = true;
      fire(u, "start");
      return;
    }
    delete queued[id];
    if (!Object.keys(queued).length) synth.speaking = synth.pending = false;
    if (type === "end") fire(u, "end");
    else fire(u, "error", { error: "synthesis-failed" });
  };

  // these are read-only on some WebView versions, so plain assignment isn't enough
  Object.defineProperty(window, "speechSynthesis", { value: synth, configurable: true });
  Object.defineProperty(window, "SpeechSynthesisUtterance", { value: Utterance, configurable: true, writable: true });

  // ---- listening

  var current = null;

  function Recognition() {
    listenable(this);
    this.lang = "en-IN";
    this.interimResults = false;
    this.continuous = false;
    this.maxAlternatives = 1;
  }
  Recognition.prototype.start = function () {
    if (current) throw new Error("already started");
    current = this;
    native.startListening(this.lang, !!this.interimResults);
  };
  Recognition.prototype.stop = function () {
    native.stopListening();
  };
  Recognition.prototype.abort = function () {
    native.abortListening();
  };

  window.__androidStt = function (type, text, final) {
    var rec = current;
    if (!rec) return;
    if (type === "result") {
      var alternative = [{ transcript: text, confidence: 1 }];
      alternative.isFinal = !!final;
      alternative.length = 1;
      var results = [alternative];
      fire(rec, "result", { results: results, resultIndex: 0 });
    } else if (type === "error") {
      fire(rec, "error", { error: text });
    } else if (type === "end") {
      current = null;
      fire(rec, "end");
    }
  };

  // the mic button stays hidden on phones with no recogniser, as it does in unsupported browsers
  if (native.canListen()) {
    Object.defineProperty(window, "SpeechRecognition", { value: Recognition, configurable: true, writable: true });
    Object.defineProperty(window, "webkitSpeechRecognition", { value: Recognition, configurable: true, writable: true });
  }
})();
