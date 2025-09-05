@echo off
chcp 65001 >nul
echo 🚀 Docker 개발 환경을 시작합니다...

:: Docker Compose 실행 (빌드 포함)
docker compose up --build

echo ✅ 서버가 실행되었습니다.
pause
