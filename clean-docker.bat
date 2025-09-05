@echo off
chcp 65001 >nul
echo 🧹 Docker 정리 작업을 시작합니다...

echo 📦 사용하지 않는 Docker 이미지들을 삭제합니다...
docker image prune -f

echo 🗑️ 사용하지 않는 Docker 컨테이너들을 삭제합니다...
docker container prune -f

echo 🌐 사용하지 않는 Docker 네트워크들을 삭제합니다...
docker network prune -f

echo 💾 사용하지 않는 Docker 볼륨들을 삭제합니다...
docker volume prune -f

echo 🧽 Docker 빌드 캐시를 정리합니다...
docker builder prune -f

echo 🎯 프로젝트 관련 이미지들을 강제로 삭제합니다...
docker rmi reroute-frontend reroute-backend reroute-db 2>nul || echo 이미지가 이미 삭제되었거나 존재하지 않습니다.

echo ✅ Docker 정리 작업이 완료되었습니다!
echo.
echo 💡 다음 명령어로 정리된 상태를 확인할 수 있습니다:
echo    docker images
echo    docker system df

pause
