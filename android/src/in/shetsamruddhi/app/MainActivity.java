package in.shetsamruddhi.app;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.ContentValues;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.text.InputType;
import android.view.Gravity;
import android.view.View;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Locale;

/** Shows the Shet Samruddhi web app, and gives it the phone's camera, location and speech. */
public class MainActivity extends Activity {
    private static final String PREFS = "shet";
    private static final String KEY_SERVER = "server";
    private static final String DEFAULT_SERVER = "http://192.168.1.114:3000";
    private static final int REQUEST_FILE = 1;
    private static final int REQUEST_MIC = 2;
    private static final int REQUEST_LOCATION = 3;
    private static final String[] SPOKEN_LANGUAGES = {"mr-IN", "hi-IN", "en-IN"};

    private WebView web;
    private String bridgeScript = "";
    private ValueCallback<Uri[]> pendingFiles;
    private Uri cameraUri;
    private GeolocationPermissions.Callback pendingLocation;
    private String pendingLocationOrigin;

    private TextToSpeech tts;
    private boolean ttsReady;
    private SpeechRecognizer recognizer;
    private String pendingListenLang;
    private boolean pendingListenInterim;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().setStatusBarColor(Color.parseColor("#1F5B3A"));
        bridgeScript = readAsset("speech-bridge.js");
        tts = new TextToSpeech(this, status -> {
            ttsReady = status == TextToSpeech.SUCCESS;
            callPage("window.__androidTts && window.__androidTts('', 'voiceschanged')");
        });
        tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
            @Override public void onStart(String id) { ttsEvent(id, "start"); }
            @Override public void onDone(String id) { ttsEvent(id, "end"); }
            @Override public void onError(String id) { ttsEvent(id, "error"); }
        });
        openApp(null);
    }

    @Override
    protected void onDestroy() {
        tts.shutdown();
        if (recognizer != null) recognizer.destroy();
        if (web != null) web.destroy();
        web = null;
        super.onDestroy();
    }

    private SharedPreferences prefs() {
        return getSharedPreferences(PREFS, MODE_PRIVATE);
    }

    private String server() {
        return prefs().getString(KEY_SERVER, DEFAULT_SERVER);
    }

    // ---- the web app

    private void openApp(String path) {
        if (web != null) web.destroy();
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setGeolocationEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        web.addJavascriptInterface(new VoiceBridge(), "AndroidVoice");
        web.setWebViewClient(new AppClient());
        web.setWebChromeClient(new AppChrome());
        setContentView(web);
        web.loadUrl(path == null ? server() : server() + path);
    }

    private class AppClient extends WebViewClient {
        @Override
        public void onPageStarted(WebView view, String url, android.graphics.Bitmap icon) {
            view.evaluateJavascript(bridgeScript, null);
        }

        @Override
        public void onPageCommitVisible(WebView view, String url) {
            view.evaluateJavascript(bridgeScript, null);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            view.evaluateJavascript(bridgeScript, null);
        }

        /** Only the app stays inside; scheme websites and phone links open in their own apps. */
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri target = request.getUrl();
            Uri home = Uri.parse(server());
            if (target.getHost() != null && target.getHost().equals(home.getHost()) && target.getPort() == home.getPort()) return false;
            try {
                startActivity(new Intent(Intent.ACTION_VIEW, target));
            } catch (ActivityNotFoundException ignored) {
                // nothing on this phone can open it
            }
            return true;
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            if (request.isForMainFrame()) showServerScreen(true);
        }
    }

    private class AppChrome extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (pendingFiles != null) pendingFiles.onReceiveValue(null);
            pendingFiles = callback;
            Intent choose = params.createIntent();
            ArrayList<Intent> extras = new ArrayList<>();
            cameraUri = null;
            // the camera saves to the phone's gallery; older Android would need a storage permission for this
            if (wantsImage(params) && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                try {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Images.Media.DISPLAY_NAME, "shet-" + System.currentTimeMillis() + ".jpg");
                    values.put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg");
                    cameraUri = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                    Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                    camera.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
                    extras.add(camera);
                } catch (RuntimeException e) {
                    cameraUri = null;
                }
            }
            Intent chooser = Intent.createChooser(choose, null);
            chooser.putExtra(Intent.EXTRA_INITIAL_INTENTS, extras.toArray(new Intent[0]));
            try {
                startActivityForResult(chooser, REQUEST_FILE);
            } catch (ActivityNotFoundException e) {
                pendingFiles.onReceiveValue(null);
                pendingFiles = null;
                return false;
            }
            return true;
        }

        private boolean wantsImage(FileChooserParams params) {
            for (String type : params.getAcceptTypes()) if (type.startsWith("image/")) return true;
            return false;
        }

        @Override
        public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                callback.invoke(origin, true, false);
                return;
            }
            pendingLocation = callback;
            pendingLocationOrigin = origin;
            requestPermissions(new String[] {Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, REQUEST_LOCATION);
        }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != REQUEST_FILE || pendingFiles == null) return;
        Uri[] chosen = null;
        if (result == RESULT_OK) {
            if (data != null && data.getData() != null) chosen = new Uri[] {data.getData()};
            else if (data != null && data.getClipData() != null) {
                chosen = new Uri[data.getClipData().getItemCount()];
                for (int i = 0; i < chosen.length; i++) chosen[i] = data.getClipData().getItemAt(i).getUri();
            } else if (cameraUri != null) chosen = new Uri[] {cameraUri};
        }
        // an empty entry stays behind in the gallery if the camera was opened and then cancelled
        if (cameraUri != null && (chosen == null || chosen[0] != cameraUri)) {
            try {
                getContentResolver().delete(cameraUri, null, null);
            } catch (RuntimeException ignored) {
                // nothing more to tidy
            }
        }
        pendingFiles.onReceiveValue(chosen);
        pendingFiles = null;
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.getVisibility() == View.VISIBLE && web.canGoBack()) {
            web.goBack();
            return;
        }
        new AlertDialog.Builder(this)
                .setTitle("Shet Samruddhi")
                .setItems(new String[] {"Exit / बाहेर पडा", "Change server address / सर्व्हर पत्ता बदला"}, (dialog, which) -> {
                    if (which == 0) finish();
                    else showServerScreen(false);
                })
                .show();
    }

    // ---- choosing the server: a laptop's Wi-Fi address changes from place to place

    private void showServerScreen(boolean failed) {
        LinearLayout box = new LinearLayout(this);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setGravity(Gravity.CENTER);
        box.setBackgroundColor(Color.parseColor("#FBF7EF"));
        int pad = (int) (24 * getResources().getDisplayMetrics().density);
        box.setPadding(pad, pad, pad, pad);

        TextView title = new TextView(this);
        title.setText("Shet Samruddhi");
        title.setTextSize(28);
        title.setTextColor(Color.parseColor("#1F5B3A"));
        title.setGravity(Gravity.CENTER);
        box.addView(title);

        TextView note = new TextView(this);
        note.setText(failed
                ? "Couldn't reach the app. Check the internet or Wi-Fi, and the address below.\nअ‍ॅपशी जोडणी झाली नाही. इंटरनेट किंवा वाय-फाय व खालील पत्ता तपासा."
                : "Server address\nसर्व्हरचा पत्ता");
        note.setTextSize(16);
        note.setTextColor(Color.parseColor("#3A3A3A"));
        note.setGravity(Gravity.CENTER);
        note.setPadding(0, pad, 0, pad);
        box.addView(note);

        EditText address = new EditText(this);
        address.setSingleLine(true);
        address.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);
        address.setHint("http://192.168.1.10:3000");
        address.setText(server());
        box.addView(address);

        Button connect = new Button(this);
        connect.setText("Connect / जोडा");
        connect.setOnClickListener(v -> {
            String typed = address.getText().toString().trim().replaceAll("/+$", "");
            if (typed.isEmpty()) return;
            if (!typed.startsWith("http://") && !typed.startsWith("https://")) typed = "http://" + typed;
            prefs().edit().putString(KEY_SERVER, typed).apply();
            openApp(null);
        });
        box.addView(connect);
        setContentView(box);
    }

    // ---- what the page can ask of the phone

    private void callPage(String script) {
        runOnUiThread(() -> {
            if (web != null) web.evaluateJavascript(script, null);
        });
    }

    private void ttsEvent(String id, String type) {
        callPage("window.__androidTts && window.__androidTts(" + JSONObject.quote(id) + "," + JSONObject.quote(type) + ")");
    }

    private void sttEvent(String type, String text, boolean finalResult) {
        callPage("window.__androidStt && window.__androidStt(" + JSONObject.quote(type) + "," + JSONObject.quote(text) + "," + finalResult + ")");
    }

    /** Called from the page's JavaScript, so everything here may be on a background thread. */
    private class VoiceBridge {
        @JavascriptInterface
        public String voices() {
            JSONArray list = new JSONArray();
            if (!ttsReady) return list.toString();
            for (String tag : SPOKEN_LANGUAGES) {
                int state = tts.isLanguageAvailable(Locale.forLanguageTag(tag));
                if (state < TextToSpeech.LANG_AVAILABLE) continue;
                try {
                    list.put(new JSONObject().put("name", "Android " + tag).put("lang", tag));
                } catch (org.json.JSONException ignored) {
                    // these keys and strings are always valid
                }
            }
            return list.toString();
        }

        @JavascriptInterface
        public void speak(String id, String text, String lang, float rate) {
            if (!ttsReady) {
                ttsEvent(id, "error");
                return;
            }
            tts.setLanguage(Locale.forLanguageTag(lang));
            tts.setSpeechRate(rate);
            if (tts.speak(text, TextToSpeech.QUEUE_ADD, null, id) != TextToSpeech.SUCCESS) ttsEvent(id, "error");
        }

        @JavascriptInterface
        public void stopSpeaking() {
            tts.stop();
        }

        @JavascriptInterface
        public boolean canListen() {
            return SpeechRecognizer.isRecognitionAvailable(MainActivity.this);
        }

        @JavascriptInterface
        public void startListening(String lang, boolean interim) {
            runOnUiThread(() -> {
                if (checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                    listen(lang, interim);
                    return;
                }
                pendingListenLang = lang;
                pendingListenInterim = interim;
                requestPermissions(new String[] {Manifest.permission.RECORD_AUDIO}, REQUEST_MIC);
            });
        }

        @JavascriptInterface
        public void stopListening() {
            runOnUiThread(() -> {
                if (recognizer != null) recognizer.stopListening();
            });
        }

        @JavascriptInterface
        public void abortListening() {
            runOnUiThread(() -> {
                if (recognizer != null) recognizer.cancel();
                sttEvent("end", "", false);
            });
        }
    }

    private void listen(String lang, boolean interim) {
        if (recognizer != null) recognizer.destroy();
        recognizer = SpeechRecognizer.createSpeechRecognizer(this);
        recognizer.setRecognitionListener(new RecognitionListener() {
            private String firstOf(Bundle results) {
                ArrayList<String> heard = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                return heard == null || heard.isEmpty() ? "" : heard.get(0);
            }

            @Override public void onPartialResults(Bundle partial) {
                String text = firstOf(partial);
                if (!text.isEmpty()) sttEvent("result", text, false);
            }

            @Override public void onResults(Bundle results) {
                String text = firstOf(results);
                if (!text.isEmpty()) sttEvent("result", text, true);
                sttEvent("end", "", false);
            }

            @Override public void onError(int error) {
                sttEvent("error", errorName(error), false);
                sttEvent("end", "", false);
            }

            @Override public void onReadyForSpeech(Bundle params) {}
            @Override public void onBeginningOfSpeech() {}
            @Override public void onRmsChanged(float rms) {}
            @Override public void onBufferReceived(byte[] buffer) {}
            @Override public void onEndOfSpeech() {}
            @Override public void onEvent(int type, Bundle params) {}
        });
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang);
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, interim);
        recognizer.startListening(intent);
    }

    /** The same names the browser's speech API uses, which the web app already explains to the farmer. */
    private static String errorName(int error) {
        switch (error) {
            case SpeechRecognizer.ERROR_NO_MATCH:
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "no-speech";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "not-allowed";
            case SpeechRecognizer.ERROR_NETWORK:
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "network";
            default:
                return "aborted";
        }
    }

    @Override
    public void onRequestPermissionsResult(int request, String[] permissions, int[] results) {
        boolean granted = results.length > 0 && Arrays.stream(results).anyMatch(r -> r == PackageManager.PERMISSION_GRANTED);
        if (request == REQUEST_MIC) {
            if (granted) listen(pendingListenLang, pendingListenInterim);
            else {
                sttEvent("error", "not-allowed", false);
                sttEvent("end", "", false);
            }
        } else if (request == REQUEST_LOCATION && pendingLocation != null) {
            pendingLocation.invoke(pendingLocationOrigin, granted, false);
            pendingLocation = null;
        }
    }

    private String readAsset(String name) {
        try (InputStream in = getAssets().open(name); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            for (int n; (n = in.read(buffer)) > 0; ) out.write(buffer, 0, n);
            return new String(out.toByteArray(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            return "";
        }
    }
}
