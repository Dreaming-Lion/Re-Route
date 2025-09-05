#!/usr/bin/env bash
set -euo pipefail

echo "▶ Setup starting..."

# 0) 도구 점검
command -v docker >/dev/null || { echo "❌ docker not found"; exit 1; }
if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE="docker compose"
else
  # 구버전 호환
  command -v docker-compose >/dev/null || { echo "❌ docker compose(CL I) not found"; exit 1; }
  DOCKER_COMPOSE="docker-compose"
fi

# 1) 디렉토리 준비
mkdir -p backend frontend

# 2) .env 기본값 생성 (없을 때만)
if [ ! -f .env ]; then
  cat > .env <<'ENV'
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=apppass
ENV
  echo "✓ .env created"
else
  echo "• .env already exists (skip)"
fi

# 3) 줄바꿈(LF)로 정리 + 실행권한 부여 대상
FILES=(
  "start-dev.sh"
  "stop-dev.sh"
  "clean-docker.sh"
  "backend/entrypoint.sh"
  "frontend/entrypoint.sh"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    # CRLF -> LF
    sed -i 's/\r$//' "$f" || true
    chmod +x "$f" || true
    echo "✓ fixed & chmod +x $f"
  else
    echo "• skip (missing): $f"
  fi
done

# 4) compose 파일 빠른 문법 검사
if [ -f docker-compose.yml ]; then
  echo "▶ Validating docker-compose.yml ..."
  $DOCKER_COMPOSE config >/dev/null
  echo "✓ docker-compose.yml looks good"
else
  echo "❌ docker-compose.yml not found in current directory"
  exit 1
fi

# 5) 옵션 처리: --up 이면 바로 빌드/실행
if [ "${1-}" = "--up" ]; then
  echo "▶ Bringing up containers (build)…"
  COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 $DOCKER_COMPOSE up --build
else
  echo "✅ Setup done. (Run: ./start-dev.sh  or  $DOCKER_COMPOSE up --build)"
fi
