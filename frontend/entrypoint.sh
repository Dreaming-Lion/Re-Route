#!/usr/bin/env bash
set -euo pipefail
cd /workspace

# 0) package.json 깨졌다면 복구
if [ -f package.json ]; then
  if [ ! -s package.json ] || ! node -e "require('./package.json')" >/dev/null 2>&1; then
    echo "package.json invalid -> reinit"
    rm -f package.json package-lock.json
    rm -rf node_modules
  fi
fi

# 1) 앱이 없으면 생성 (비대화식)
if [ ! -f package.json ]; then
  echo "Creating Expo app..."
  npx --yes create-expo-app@latest . --template blank --no-install
fi

# 2) 의존성 설치 (idempotent)
if [ ! -d node_modules ]; then
  echo "Installing deps..."
  npm install
  npm i nativewind tailwindcss postcss react-native-reanimated
  npx tailwindcss init --full || true
fi

# 3) 웹 실행이라면 웹 의존성 보장
#    (--web로 기동하므로 react-native-web, react-dom, @expo/metro-runtime 필요)
if ! node -e "require.resolve('react-native-web')" >/dev/null 2>&1; then
  echo "Installing web deps for Expo..."
  npx expo install react-native-web react-dom @expo/metro-runtime
fi

# 4) Tailwind/Babel 설정 보증
cat > tailwind.config.js <<'JS'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
}
JS

cat > babel.config.js <<'JS'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
JS

# 5) 엔트리 보증: index.js + App.tsx
if [ ! -f index.js ]; then
cat > index.js <<'JS'
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
JS
fi

if [ ! -f App.tsx ] && [ ! -f App.js ]; then
cat > App.tsx <<'TSX'
import { Text, View } from 'react-native';
export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold">Hello from Expo + NativeWind 👋</Text>
    </View>
  );
}
TSX
fi

# 6) Expo 기동 (LAN + Web)
exec npx expo start --lan --port 19000 --clear --web
