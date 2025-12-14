FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

COPY . .
RUN sed -i 's/\r$//' gradlew || true
RUN chmod +x gradlew

RUN ./gradlew clean bootJar --no-daemon

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
