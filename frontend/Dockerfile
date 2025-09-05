# frontend/Dockerfile
FROM node:20-bullseye

WORKDIR /workspace

# Preinstall expo-cli
RUN corepack enable && npm i -g expo@^51

COPY entrypoint.sh ./
RUN chmod +x /workspace/entrypoint.sh