#!/usr/bin/env bash
set -euo pipefail

# ---- 옵션 -------------------------------------------------------
# 기본: 모바일/LAN 모드 (웹 안 씀)
# --web : 웹도 함께(19006) 실행하고 웹 의존성 자동 설치
USE_WEB=0
if [[ "${1-}" == "--web" ]]; then
  USE_WEB=1
fi

echo "▶ Preparing scripts & env..."
# 윈도우 CRLF 방지 + 실행권한
for f in backend/entrypoint.sh frontend/entrypoint.sh; do
  [[ -f "$f" ]] && sed -i 's/\r$//' "$f" && chmod +x "$f" || true
done

# .env 기본값(없으면 생성)
if [[ ! -f .env ]]; then
  cat > .env <<'ENV'
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppass
ENV
  echo "✓ .env created"
fi

# compose 유효성 체크
echo "▶ Validating docker-compose.yml..."
docker compose config >/dev/null
echo "✓ docker-compose.yml OK"

# ---- 프론트엔드 의존성/파일 보장(one-off 컨테이너에서 수행) ---------
echo "▶ Ensuring frontend deps (this may take a minute)..."
# USE_WEB 값을 컨테이너에 넘김(-e)
docker compose run --rm -T -e USE_WEB="$USE_WEB" frontend bash <<'BASH'
set -e
cd /workspace

# 0) package.json 깨졌으면 복구
if [ -f package.json ]; then
  if [ ! -s package.json ] || ! node -e "require('./package.json')" >/dev/null 2>&1; then
    echo "• package.json invalid → reinit"
    rm -f package.json package-lock.json
    rm -rf node_modules
  fi
fi

# 1) 앱 생성(최초만)
if [ ! -f package.json ]; then
  echo "• Creating Expo app (non-interactive)..."
  npx --yes create-expo-app@latest . --template blank --no-install
fi

# 2) 기본 설치
if [ ! -d node_modules ]; then
  echo "• npm install"
  npm install
fi

# 3) expo 패키지 보장
node -e "require.resolve('expo/package.json')" >/dev/null 2>&1 || npm i expo@^51

# 4) NativeWind/Tailwind 보장(+ tailwind.config 생성)
node -e "require.resolve('nativewind/package.json')" >/dev/null 2>&1 || \
  (npm i nativewind tailwindcss postcss react-native-reanimated && npx tailwindcss init --full || true)

# 5) Babel 설정: 오직 babel.config.js 하나만(정답본)
#    (.babelrc / package.json#babel 등은 제거)
cat > babel.config.js <<'JS'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
JS
rm -f .babelrc .babelrc.json
node -e "const fs=require('fs');const p=require('./package.json');if(p.babel){delete p.babel;fs.writeFileSync('package.json', JSON.stringify(p,null,2));}"

# 6) 엔트리 보증
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
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-2xl font-bold'>Hello from Expo + NativeWind 👋</Text>
    </View>
  );
}
TSX
fi

# 7) 웹 모드면 웹 의존성 보장
if [ "${USE_WEB:-0}" = "1" ]; then
  echo "• Installing web deps (react-native-web, react-dom, @expo/metro-runtime)"
  npx expo install react-native-web react-dom @expo/metro-runtime
fi

# 8) 줄바꿈 정리(윈도우 방지)
sed -i 's/\r$//' babel.config.js index.js || true
BASH

# ---- 컨테이너 실행 -------------------------------------------------
echo "▶ Bringing up containers (detached)..."
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up -d --build

echo "▶ Current services:"
docker compose ps

# 웹/매니페스트 포트 대기 후 간단 점검
echo "▶ Waiting 5s for Metro/Expo to boot..."
sleep 5

echo "▶ Frontend last logs:"
docker compose logs --tail=120 frontend
