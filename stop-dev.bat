@echo off
chcp 65001 >nul
echo 🛑 Docker 개발 환경을 중지합니다...

docker compose down

echo ✅ 모든 컨테이너가 중지되었습니다.
pause
