#!/usr/bin/env bash
set -euo pipefail
cd /workspace

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

# 2) 의존성 설치
if [ ! -d node_modules ]; then
  echo "• npm install"
  npm install
fi

# 3) Expo / Reanimated 보장
node -e "require.resolve('expo/package.json')" >/dev/null 2>&1 || npm i expo@^51
npx expo install react-native-reanimated || npm i react-native-reanimated

# 4) (최종 기준) NativeWind/Tailwind는 사용하지 않음 → 잔재 제거
npm remove nativewind tailwindcss postcss >/dev/null 2>&1 || true
rm -f metro.config.js tailwind.config.js global.css

# 5) 웹 의존성(필요 시)
if [ "${USE_WEB:-0}" = "1" ]; then
  npx expo install react-native-web react-dom @expo/metro-runtime || true
fi

# 6) 컨테이너 생존(서버 미기동)
echo "✓ Frontend ready. Waiting… (Expo will be started by start-dev.sh)"
tail -f /dev/null
