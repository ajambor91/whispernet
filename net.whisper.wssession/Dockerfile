FROM openjdk:22-jdk

WORKDIR /app
COPY cfg/application.properties /usr/app/application.properties

RUN microdnf install findutils
COPY gradlew .
COPY gradle gradle
COPY . .

RUN ./gradlew build --no-daemon
ENTRYPOINT ["java", "-jar", "build/libs/wssession-0.0.1-SNAPSHOT.jar",  "--spring.config.additional-location=/usr/app/application.properties"]
