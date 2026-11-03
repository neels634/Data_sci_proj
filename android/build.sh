#!/usr/bin/env bash
# Builds and signs the Android app with the SDK's own tools (no Gradle, no downloads).
#   bash android/build.sh
# Needs: Android SDK build-tools and a platform, and a JDK 17 or newer (JDK_HOME, or found in ~/.jdks).
# The signing key stays on this machine; lose it and phones must uninstall before the next update.
set -euo pipefail
cd "$(dirname "$0")"

SDK="${ANDROID_HOME:-$LOCALAPPDATA/Android/Sdk}"
TOOLS="$(ls -d "$SDK"/build-tools/* | sort -V | tail -1)"
ANDROID_JAR="$(ls "$SDK"/platforms/*/android.jar | sort -V | tail -1)"
JDK="${JDK_HOME:-$(ls -d "$HOME"/.jdks/* | sort -V | tail -1)}"
export JAVA_HOME="$JDK"
export PATH="$JDK/bin:$PATH"

VERSION_CODE="${VERSION_CODE:-1}"
VERSION_NAME="${VERSION_NAME:-1.0}"

rm -rf build
mkdir -p build/classes build/dex

# target 34: from 35 Android draws apps under the status bar, and the web layout doesn't allow for that
"$TOOLS/aapt2" compile --dir res -o build/res.zip
"$TOOLS/aapt2" link -o build/base.apk -I "$ANDROID_JAR" --manifest AndroidManifest.xml \
  --min-sdk-version 24 --target-sdk-version 34 --version-code "$VERSION_CODE" --version-name "$VERSION_NAME" \
  -A assets build/res.zip

javac --release 11 -encoding UTF-8 -Xlint:-options -nowarn -cp "$ANDROID_JAR" -d build/classes $(find src -name '*.java')
"$TOOLS/d8.bat" --release --min-api 24 --lib "$ANDROID_JAR" --output build/dex $(find build/classes -name '*.class')

python - <<'PY'
import zipfile
with zipfile.ZipFile("build/base.apk", "a", zipfile.ZIP_DEFLATED) as apk:
    apk.write("build/dex/classes.dex", "classes.dex")
PY

"$TOOLS/zipalign" -f 4 build/base.apk build/aligned.apk

if [ ! -f shet-samruddhi.keystore ]; then
  python -c "import secrets; print(secrets.token_urlsafe(24))" > keystore.pass
  keytool -genkeypair -keystore shet-samruddhi.keystore -alias shet -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass:file keystore.pass -dname "CN=Shet Samruddhi, O=Phaltan Hackathon, C=IN"
fi
"$TOOLS/apksigner.bat" sign --ks shet-samruddhi.keystore --ks-key-alias shet --ks-pass file:keystore.pass \
  --out build/ShetSamruddhi.apk build/aligned.apk
"$TOOLS/apksigner.bat" verify --print-certs build/ShetSamruddhi.apk | head -3
ls -l build/ShetSamruddhi.apk
