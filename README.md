
<div style="text-align: center; margin: 0">
<img src="ui/pics/whispernet_logo_256_transparent.png">
</div>
<h1 style="text-align: center; font-size: 3em;  margin-top: -30px; margin-bottom: 60px">
WhisperNet
</h1> 
<h2 style="text-align: center; font-size: 1.8em;  margin-top: -50px; margin-bottom: 60px">
A secure and anonymous peer-to-peer chat platform.
</h2> 

WhisperNet is a decentralized communication platform designed to provide private and real-time messaging between users. The project is built on a microservices architecture, ensuring scalability, modularity, and fault tolerance.

---

## Features

- **Decentralized Communication**: Peer-to-peer sessions using WebRTC.
- **Scalable Architecture**: Powered by Spring Boot, Node.js, and Kafka.
- **Real-Time Monitoring**: Includes Grafana, Loki, and Promtail for application logs and metrics.
- **Cross-Platform**: Frontend built in React.
- **WebRTC**: Session signaling with a test TURN server.
- **WebAssembly**: Message sanitizing and AES 256 encoding and decoding for higher security and customizability.
- **PGP Authorization**: Signing and requiring session signatures from receivers.
- **CMS**: Landing page built with PHP and Symfony.

---

## Tech Stack

- **Backend**:
    - Java 22 
    - Spring Boot 3.3.4 microservices:
        - **Session**: Handles user creation and management.
        - **WSSession**: Creates and manages WebRTC sessions.
        - **Security**: User register, login and verifying
    - Node.js microservice:
        - **WebSocket Service**: Pairs users for communication.
        - **Approving Service**: Responsible for sending notifications to users when their connection request is accepted after PGP key verification.
    - Kafka: Handles asynchronous communication between microservices.
    - Redis: Stores session data for quick access.
    - Security Redis: Stores JWT token and currently signed-in users, also stores initialized login user data 
    - Security DB: MariaDB which stores user data as username and PGP Public Key
- **Frontend**:
    - React: A modern, responsive UI for the chat platform.
    - WebAssembly: C++ with emscripten

- **Infrastructure**:
    - Gateway: Nginx server as gateway to all docker application 
    - Grafana + Loki + Promtail: For real-time monitoring and logging.
    - Docker: Containerized deployment of all services.
    - TURN Server: Coturn server for WebRTC signaling (currently in testing).
    - Isolated networks for app - whispernet, security - whisperner-security, cms - whispernet-cms and frontend - whispernet-ui

- **CMS**
  - PHP 8.2 with Symfony 7.2 framework for higher performance

---

## Architecture Overview

### System Diagram

#### Main application
```plaintext
Frontend (React) --> Security --> Security Redis
    |                   |
    |                   v
    |                Security DB
    |
    v
Session(Spring Boot) ----> Approving Server (Node.js) < -- > Frontend
    |
    |         Security --> Security DB
    |         ^     |
    |         |     v 
    |         |     Security Redis 
    |         |     
    +------ Kafka --> WSSession (Spring Boot) <-- Kafka --> Signal-Server (Node.js) <--> Frontend 
    |                  |
    |                  +--> Redis
    v
Frontend (React)
    ^
    |
    v
Signal-Server (Node.js)
```

#### CMS
``` plaintext
Frontend (Next.js)
    
    |
    v
Backend (Symfony) --> Database (mariadb)
```


### Component Descriptions

- **Frontend (React)**:  
  Users interact with the chat application and communicate directly with the Signal-Server for WebRTC signaling.

- **Session (Spring Boot)**:  
  Handles user creation and sends messages to WSSession via Kafka. Optionally interacts with Redis for temporary data storage.

- **WSSession (Spring Boot)**:  
  Manages WebSocket sessions, interacts with Redis for session data, and sends messages to Signal-Server via Kafka.

- **Security (Spring Boot)**
  Manages users resister, login, and verification

- **Signal-Server (Node.js)**:  
  Handles WebRTC signaling and connects directly to the frontend. Optionally interacts with Redis for connection state management.
- **Approving Server (Node.js)**:
  Informs users that their connection request has been accepted.
- **Kafka**:  
  Acts as a reliable messaging bus between all microservices.

- **Redis**:  
  Serves as a fast in-memory store for session data and temporary states.

- **Security Redis**:
  Stores currently verified or waiting for verifying users
- **Security DB**:
  Stores users PGP Key for identity verification

## Installation

### Prerequisites

- Docker and Docker Compose
- Node.js and npm
- Java 17+ for Spring Boot (included in docker)
- Redis (included in Docker)
- PHP 8.2 and composer (included in docker)

---

### Steps to Run Locally

### Dev environment
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ajambor91/whispernet.git
   cd whispernet
   ```
2. **Generate ssl server.crt and server.key files and replace server_dummy files in nginx directory**
3. **Genereate JWT token and replace login.jwt.secret in net.whisper.security/cfg/application.properties**
4. **For CMS move to /cms/project_root/whispernet-cms and copy .env.local and remove .local suffix then run composer install, CMS is not requried to run main application**
5. **Run containers stack**
    ```bash
    docker-compose build
    docker-compose up -d
   ```
6. **Run frontend app**
    ```bash
    cd ui
    npm install or yarn install *
    cd ui/wb
    npm run dev
    
7. **Run CMS frontend**
    ```bash
   cd ui
   npm install or yarn install *
   cd ui/cms
   npm run dev

* *You only need to run one install command in the main ui directory

Open http://localhost:3200 in web browser for main application.
Open http://localhost:3100 in web browser for cms frontend.
Open http://localhost:8099/cms/dashboard for administrator panel

cms-db directory contains example data for cms and example user with credentials test@teest.test, altough you can create your own user running from dir in cms service or (if you have php installed) in cms project root on your host machine

```bash
   php bin/console app:make-admin email@domain.example examplePassword
```
MariaDB instance in cms-db service has two example users - root and exampleUser, both has password 3x@mplePassword. All services has example configs and SSL keys.

### Local test environment
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ajambor91/whispernet.git
   cd whispernet
   ```
2. **Generate ssl server.crt and server.key files and replace server_dummy files in nginx directory**
3. **Genereate JWT token and replace login.jwt.secret in net.whisper.security/cfg/application.properties.local**
4. **Copy nginx.example.conf from nginx-host directory, or create similar configuration for nginx or apache**
5. **Generate your SSL certificates and replace whispernet_dummy and chat-whispernet_dummy with the new ones. Then, remove the _dummy suffix from the file names.**
6. **Run containers stack**
    ```bash
    docker-compose -f ./docker-compose.local-frontend.yml build
    docker-compose -f ./docker-compose.local-frontend.yml up -d
   ```
Open your web browser with https://whispernet.local for main page or https://chat.whispernet.local, frontend for both cms and app is included in docker
***SSL is required for the app because user tokens, needed to connect sessions, are stored in secure cookies only***

### QA Environment
You can also use QA Environment. You should reneme all Dockerfile.example.qa in their respective dirs and create configs by duplicating existing *.example.* files and renaming them (e.g., redis.example.qa.conf → redis.qa.conf), and make all steps from Local test environment like generating SSL or JWT. Adjust the values as needed. QA Environments is similar to Local Test
Then run:
```bash
docker-compose -f ./docker-compose.qa.yml build
docker-compose -f ./docker-compose.qa.yml up -d
```
In this version you have to set loki data source in grafana as http://loki:3100, in CMS you should create your admin in CMS container: php bin/console app:make-admin login@domain.example password, and next create your content in dashboard.

### Production Envrionment
This environment has similar requirment as QA environments, you should replace all Dockerfile.prod and all config files, but containers and configs are production-ready optimized. In this stack you have to type your domain in cms frontend .env files and type it into nginx-host configuration.
```bash
docker-compose -f ./docker-compose.prod.yml build
docker-compose -f ./docker-compose.prod.yml up -d
```

### Monitoring - Grafana

Open your web browser and type http://localhost:3000. Example credentials are user: admin, password: examplePassword; apps to explore are:
- wssession 
- session
- websocket
- security
- frontend
- gateway
- kafka


## Test Coverage

Currently, tests have been implemented for the **Session-Service** microservice, with the following coverage statistics:

| Service              | Test Coverage  | Notes                                                      |
|----------------------|----------------|------------------------------------------------------------|
| **Session-Service**  | 88%            | Mostly integration or hybrid tests completed using Jacoco. |
| **WSSession**        | 91%            | Mostly integration or hybrid tests completed using Jacoco. |
| **Security**         | Not yet testet | Planned for future coverage.                               |
| **Signal-Server**    | Not yet tested | Planned for future coverage.                               |
| **Approving-Server** | Not yet tested | Planned for future coverage.                               |


### Coverage Report

The coverage report for **Session-Service** has been generated using [Jacoco](https://www.jacoco.org/).  
You can find the HTML report in the `target/site/jacoco` directory or access it via the link below:

- [Session-Service Coverage Report](https://ajambor91.github.io/whispernet/reports/session/jacoco/test/html/index.html)
- [WSSession-Service Coverage Report](https://ajambor91.github.io/whispernet/reports/wssession/jacoco/test/html/index.html)
### Notes



### Notes
*   **Demo (main branch):**  A demo of peer identity verification using PGP keys is available on the `main` branch.  You can force a session to walk through the verification process and connect to the Approving Server.
*   **Production (release/0.1.1):** The current production version resides on the `release/0.1.1` branch.

## In progress
1. **Finishing PGP signing sessions flow**
2. **Security service testing**
3. **Rejoining to session**
## Future Enhancements

Here are the planned improvements and features for WhisperNet:

1. **Fully Functional TURN Server**:
    - Deploy a fully operational TURN server (Coturn) to support WebRTC in restrictive network environments.

2. **Enhanced Test Coverage**:
    - Increase test coverage beyond 81% with additional unit, integration, and end-to-end tests.

3. **PGP Key-Based User Verification**:
    - Allow users to requiring sign session from their conversation partner 

4. **Improved Monitoring and Performance Metrics**:
    - Add advanced metrics and alerts in Grafana for real-time system health tracking.
    - Integrate Prometheus for detailed performance monitoring and analysis.

5. **Mobile Application**:
    - Build a mobile-friendly version of the application using React Native.

6. **Desktop Application**:
    - Develop a desktop version of the application using Electron for a native-like experience.
    - 
7. **Group Chat Support** (Optional):
    - Extend the application to support multi-user group chats with dynamic room creation.
    - 
8. **zkSNARK Integration** (Optional):
    - Explore the possibility of using zkSNARKs for advanced cryptographic features, such as zero-knowledge proofs.

## Contributing ##
Feel free to open issues or submit pull requests. All contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and distribute it as long as the terms of the license are followed.
