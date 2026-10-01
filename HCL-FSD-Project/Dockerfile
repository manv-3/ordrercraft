# Stage 1: Build the application using Maven and JDK 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build application package
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Lightweight runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create directory for embedded data storage
RUN mkdir -p /app/data

# Copy packaged JAR from build stage
COPY --from=build /app/target/ordercraft-0.0.1-SNAPSHOT.jar app.jar

# Railway assigns PORT dynamically
EXPOSE 8082

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
