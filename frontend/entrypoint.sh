#!/bin/sh
set -eu
cd /workspace
export EXPO_NO_INTERACTIVE=1

echo "▶ Frontend bootstrap (no server start here)"

# 0) package.json 검증/복구
if [ -f package.json ]; then
  if [ ! -s package.json ] || ! node -e "require('./package.json')" >/dev/null 2>&1; then
    echo "• package.json invalid → reinit"
    rm -f package.json package-lock.json
    rm -rf node_modules
  fi
fi

# 1) 앱 스캐폴딩(최초 1회)
if [ ! -f package.json ]; then
  echo "• Creating Expo app (non-interactive)..."
  npx --yes create-expo-app@latest . --template blank --no-install
fi

# 2) 기본 의존성
if [ ! -d node_modules ]; then
  echo "• npm install"
  npm install
fi

# 3) Expo / Reanimated 보장
node -e "require.resolve('expo/package.json')" >/dev/null 2>&1 || npm i expo@^51
npx expo install react-native-reanimated || npm i react-native-reanimated

# 3.1) 필수 패키지 보장 (sh 버전)
NEED=""
ensure() {
  PKG="$1"
  node -e "require.resolve('${PKG}/package.json')" >/dev/null 2>&1 || NEED="$NEED $PKG"
}
ensure "@react-navigation/native"
ensure "@react-navigation/native-stack"
ensure "@react-navigation/bottom-tabs"
ensure "react-native-screens"
ensure "react-native-safe-area-context"
ensure "react-native-gesture-handler"
ensure "expo-linear-gradient"
ensure "expo-router"
ensure "expo-image-picker"
ensure "@react-native-async-storage/async-storage"
ensure "@react-native-async-storage/async-storage react-native-webview"
ensure "react-native-webview"
ensure "expo-constants"
ensure "axios"


if [ -n "$NEED" ]; then
  echo "• Installing missing Expo deps:$NEED"
  # shellcheck disable=SC2086
  npx expo install $NEED || npm i $NEED
else
  echo "• Expo deps OK"
fi

if [ -f app/_layout.tsx ]; then
  grep -q 'react-native-gesture-handler' app/_layout.tsx 2>/dev/null || \
    sed -i '1i import "react-native-gesture-handler";' app/_layout.tsx
fi

if [ ! -f babel.config.js ]; then
  npm i -D @babel/core@^7 babel-preset-expo@~11.0.0
  cat > babel.config.js <<'JS'
module.exports = function(api){
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // MUST be last
  };
};
JS
fi

npm remove nativewind tailwindcss postcss >/dev/null 2>&1 || true
rm -f metro.config.js tailwind.config.js global.css

echo "✓ Frontend ready. Waiting… (Expo will be started by start-dev.sh)"
tail -f /dev/null
