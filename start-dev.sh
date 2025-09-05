#!/usr/bin/env bash
set -euo pipefail

# -----------------------------
# options
#   --web     : also run web (19006)
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
# one-off container: ensure frontend workspace
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

# 4) ensure NativeWind/Tailwind (and init config once)
node -e "require.resolve('nativewind/package.json')" >/dev/null 2>&1 || \
  (npm i nativewind tailwindcss postcss react-native-reanimated && npx tailwindcss init --full || true)

# 5) HARD RESET OF BABEL TO V7 STYLE ONLY
#    - remove legacy babel 5 traces
npm remove babel babel-core babel-cli 2>/dev/null || true
#    - delete any .babelrc variants
rm -f .babelrc .babelrc.js .babelrc.cjs .babelrc.json
#    - remove package.json#babel if exists
node -e "const fs=require('fs');const p=require('./package.json');if(p.babel){delete p.babel;fs.writeFileSync('package.json', JSON.stringify(p,null,2));console.log('• removed package.json#babel');}"

#    - ensure @babel/core v7 and expo preset present
npm i -D @babel/core@^7
npm i babel-preset-expo@~11.0.0

# 6) write canonical babel.config.js (reanimated plugin MUST be last)
cat > babel.config.js <<'JS'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // MUST be last
    ],
  };
};
JS

# 7) entry files
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

# 8) web deps when --web is requested
if [ "${USE_WEB:-0}" = "1" ]; then
  echo "• Installing web deps (react-native-web, react-dom, @expo/metro-runtime)"
  npx expo install react-native-web react-dom @expo/metro-runtime
fi

# 9) normalize line endings (Windows)
sed -i 's/\r$//' babel.config.js index.js || true
BASH

# --------------------------
# bring up containers
# --------------------------
echo "▶ Bringing up containers (detached)..."
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose up -d --build

echo "▶ Current services:"
docker compose ps

echo "▶ Waiting 5s for Metro/Expo to boot..."
sleep 5

# --------------------------
# launch Expo inside frontend
# --------------------------
echo "▶ Launching Expo (inside frontend)..."
if [[ "$USE_TUNNEL" == "1" ]]; then
  # Tunnel is best for native (phone) connectivity across NAT/firewall
  docker compose exec -T frontend bash -lc 'cd /workspace; \
    export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0; \
    export EXPO_USE_DEV_SERVER=true; \
    npx expo start --tunnel -c'
else
  if [[ "$USE_WEB" == "1" ]]; then
    # Web + LAN; pin web port to 19006 for clarity
    docker compose exec -T frontend bash -lc 'cd /workspace; \
      export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0; \
      export EXPO_USE_DEV_SERVER=true; \
      export EXPO_WEB_PORT=19006; \
      npx expo start --lan --web -c'
  else
    # Native only (LAN)
    docker compose exec -T frontend bash -lc 'cd /workspace; \
      export EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0; \
      export EXPO_USE_DEV_SERVER=true; \
      npx expo start --lan -c'
  fi
fi
