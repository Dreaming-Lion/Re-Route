#!/usr/bin/env bash
set -euo pipefail

# -----------------------------
# options
#   --web     : also run web (Expo dev server prints the URL, often 8081)
#   --tunnel  : use Expo tunnel (bypasses LAN/firewall issues)
# -----------------------------
USE_WEB=0
USE_TUNNEL=0
for arg in "${@:-}"; do
  [[ "$arg" == "--web" ]] && USE_WEB=1
  [[ "$arg" == "--tunnel" ]] && USE_TUNNEL=1
done

echo "▶ Preparing scripts & env..."
# normalize line endings & exec perms (Windows-safe)
for f in backend/entrypoint.sh frontend/entrypoint.sh; do
  [[ -f "$f" ]] && sed -i 's/\r$//' "$f" && chmod +x "$f" || true
done

# .env bootstrap
if [[ ! -f .env ]]; then
  cat > .env <<'ENV'
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppass
ENV
  echo "✓ .env created"
fi

# docker-compose validity
echo "▶ Validating docker-compose.yml..."
docker compose config >/dev/null
echo "✓ docker-compose.yml OK"

# -------------------------------------------
# one-off container: ensure frontend workspace (no server start here)
# -------------------------------------------
echo "▶ Ensuring frontend deps (this may take a minute)..."
docker compose run --rm -T -e USE_WEB="$USE_WEB" frontend bash <<'BASH'
set -e
cd /workspace

# 0) if package.json is broken, reset
if [ -f package.json ]; then
  if [ ! -s package.json ] || ! node -e "require('./package.json')" >/dev/null 2>&1; then
    echo "• package.json invalid → reinit"
    rm -f package.json package-lock.json
    rm -rf node_modules
  fi
fi

# 1) create expo app skeleton if missing
if [ ! -f package.json ]; then
  echo "• Creating Expo app (non-interactive)..."
  npx --yes create-expo-app@latest . --template blank --no-install
fi

# 2) base install
if [ ! -d node_modules ]; then
  echo "• npm install"
  npm install
fi

# 3) ensure expo v51+
node -e "require.resolve('expo/package.json')" >/dev/null 2>&1 || npm i expo@^51

# 4) adopt expo-router minimal route (stable with SDK 51)
npm i expo-router@^3
node -e "const fs=require('fs');const p=require('./package.json');p.main='expo-router/entry'; if(p.babel) delete p.babel; if(p.type) delete p.type; fs.writeFileSync('package.json', JSON.stringify(p,null,2)); console.log('• main -> expo-router/entry')"

mkdir -p app assets
if [ ! -f app/_layout.tsx ]; then
cat > app/_layout.tsx <<'TSX'
import { Stack } from 'expo-router';
export default function Layout(){ return <Stack screenOptions={{ headerShown:false }} />; }
TSX
fi
if [ ! -f app/index.tsx ]; then
cat > app/index.tsx <<'TSX'
import App from '../App';
export default App;
TSX
fi

# 5) ensure App.tsx exists (simple placeholder)
if [ ! -f App.tsx ] && [ ! -f App.js ]; then
cat > App.tsx <<'TSX'
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
export default function App() {
  return (
    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text style={{fontSize:18}}>Expo Router + RN reanimated only ✅</Text>
      <StatusBar style="auto" />
    </View>
  );
}
TSX
fi

# 6) ensure Reanimated (expo-install preferred)
node -e "require.resolve('react-native-reanimated/package.json')" >/dev/null 2>&1 || npx expo install react-native-reanimated || npm i react-native-reanimated

# 6.1) 필수 네비/안전영역/제스처/그라데이션 보장
declare -a PKGS=()
ensure () {
  local pkg="$1"
  node -e "require.resolve('${pkg}/package.json')" >/dev/null 2>&1 || PKGS+=("$pkg")
}
ensure "@react-navigation/native"
ensure "@react-navigation/native-stack"
ensure "@react-navigation/bottom-tabs"
ensure "react-native-screens"
ensure "react-native-safe-area-context"
ensure "react-native-gesture-handler"
ensure "expo-linear-gradient"
ensure "expo-image-picker"

if [ ${#PKGS[@]} -gt 0 ]; then
  echo "• Installing missing Expo deps: ${PKGS[*]}"
  npx expo install "${PKGS[@]}" || npm i "${PKGS[@]}"
else
  echo "• Expo deps OK"
fi

# 6.2) gesture-handler는 엔트리 최상단에서 import (런타임 오류 예방)
if [ -f App.tsx ]; then
  grep -q 'react-native-gesture-handler' App.tsx 2>/dev/null || sed -i '1i import "react-native-gesture-handler";' App.tsx
fi

# 7) REMOVE NativeWind/Tailwind completely (final baseline = no NativeWind)
npm remove nativewind tailwindcss postcss >/dev/null 2>&1 || true
rm -f metro.config.js tailwind.config.js global.css

# 8) Babel minimal (CJS or JS both fine) — Reanimated plugin MUST be last
rm -f .babelrc .babelrc.* babel.config.* 2>/dev/null || true
npm i -D @babel/core@^7
npm i babel-preset-expo@~11.0.0
cat > babel.config.js <<'JS'
module.exports = function(api){
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'], // MUST be last
  };
};
JS

# 9) web deps when --web is requested
if [ "${USE_WEB:-0}" = "1" ]; then
  echo "• Installing web deps (react-native-web, react-dom, @expo/metro-runtime)"
  npx expo install react-native-web react-dom @expo/metro-runtime || true
fi

# 10) normalize line endings (Windows)
sed -i 's/\r$//' app/_layout.tsx app/index.tsx App.tsx babel.config.js 2>/dev/null || true
BASH

# --------------------------
# bring up containers
# --------------------------
echo "▶ Bringing up containers (detached)..."
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up -d --build

echo "▶ Current services:"
docker compose ps

echo "▶ Waiting 5s for Expo to boot..."
sleep 5

# --------------------------
# launch Expo inside frontend
# --------------------------
echo "▶ Launching Expo (inside frontend)..."
EXPO_ENV_COMMON='export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0; export EXPO_USE_DEV_SERVER=true; export CHOKIDAR_USEPOLLING=1; export NODE_OPTIONS="--max-old-space-size=3072";'

if [[ "$USE_TUNNEL" == "1" ]]; then
  docker compose exec -T frontend bash -lc "cd /workspace; $EXPO_ENV_COMMON npx expo start --tunnel"
else
  if [[ "$USE_WEB" == "1" ]]; then
    # Web; CLI prints exact URL (often http://localhost:8081). Use that URL.
    docker compose exec -T frontend bash -lc "cd /workspace; $EXPO_ENV_COMMON npx expo start --lan --web"
  else
    # Native only (LAN)
    docker compose exec -T frontend bash -lc "cd /workspace; $EXPO_ENV_COMMON npx expo start --lan"
  fi
fi
