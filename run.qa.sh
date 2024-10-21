#!/bin/sh

chmod +x ./net.whisper.wssession/gradlew
chmod +x ./net.whisper.session/gradlew

rm -rf ./ui/node_modules
rm -rf ./ui/package-lock.json

rm -rf ./ui/web/package-lock.json
rm -rf ./ui/web/node_modules

docker compose -f docker-compose.qa.yml down

docker compose -f docker-compose.qa.yml up --build -d
