# WhisperNet

**A secure and anonymous peer-to-peer chat platform powered by WebRTC, Kafka, and React.**

WhisperNet is a decentralized communication platform designed to provide private and real-time messaging between users. The project is built on a microservices architecture, ensuring scalability, modularity, and fault tolerance.

---

## Features

- **Decentralized Communication**: Peer-to-peer sessions using WebRTC.
- **Scalable Architecture**: Powered by Spring Boot, Node.js, and Kafka.
- **Real-Time Monitoring**: Includes Grafana, Loki, and Promtail for application logs and metrics.
- **Cross-Platform**: Frontend built in React.
- **WebRTC**: Session signaling with a test TURN server.
- **WebAssembly**: Message sanitizing and AES 256 encoding and decoding for higher security and customizability
- **CMS**: Landing page built with PHP and Symfony

---

## Tech Stack

- **Backend**:
    - Java 22 
    - Spring Boot 3.3.4 microservices:
        - **Session**: Handles user creation and management.
        - **WSSession**: Creates and manages WebRTC sessions.
    - Node.js microservice:
        - **WebSocket Service**: Pairs users for communication.
    - Kafka: Handles asynchronous communication between microservices.
    - Redis: Stores session data for quick access.
    
- **Frontend**:
    - React: A modern, responsive UI for the chat platform.
    - WebAssembly: C++ with emscripten

- **Infrastructure**:
    - Grafana + Loki + Promtail: For real-time monitoring and logging.
    - Docker: Containerized deployment of all services.
    - TURN Server: Coturn server for WebRTC signaling (currently in testing).

- **CMS**
  - Isolated network and service for CMS
  - PHP 8.2 with Symfony 7.2 framework for higher performance

---

## Architecture Overview

### System Diagram

#### Main application
```plaintext
Frontend (React)
    |
    v
Session(Spring Boot)
    |
    +-- Kafka --> WSSession (Spring Boot) <-- Kafka --> Signal-Server (Node.js)
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

- **Signal-Server (Node.js)**:  
  Handles WebRTC signaling and connects directly to the frontend. Optionally interacts with Redis for connection state management.

- **Kafka**:  
  Acts as a reliable messaging bus between all microservices.

- **Redis**:  
  Serves as a fast in-memory store for session data and temporary states.


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
3. **For CMS move to /cms/project_root/whispernet-cms and copy .env.local and remove .local suffix then run composer install, CMS is not requried to run main application**
4. **Run containers stack**
    ```bash
    docker-compose build
    docker-compose up -d
   ```
5. **Run frontend app**
    ```bash
    cd ui
    npm install or yarn install *
    cd ui/wb
    npm run start
    
6. **Run CMS frontend**
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
3. **Copy nginx.example.conf from nginx-host directory, or create similar configuration for nginx or apache**
4. **Generate your SSL certificates and replace whispernet_dummy and chat-whispernet_dummy with the new ones. Then, remove the _dummy suffix from the file names.**
5. **Run containers stack**
    ```bash
    docker-compose -f ./docker-compose.local-frontend build
    docker-compose -f ./docker-compose.local-frontend up -d
   ```
Open your web browser with https://whispernet.local for main page or https://chat.whispernet.local, frontend for both cms and app is included in docker
***SSL is required for the app because user tokens, needed to connect sessions, are stored in secure cookies only***

### Monitoring - Grafana

Open your web browser and type http://localhost:3000. Example credentials are user: admin, password: examplePassword; apps to explore are:
- wssession 
- session
- websocket
- frontend


## Test Coverage

Currently, tests have been implemented for the **Session-Service** microservice, with the following coverage statistics:

| Service           | Test Coverage | Notes                              |
|--------------------|---------------|------------------------------------|
| **Session-Service** | 81%           | Unit and integration tests completed using Jacoco. |
| WSSession          | Not yet tested | Planned for future coverage.      |
| Signal-Server      | Not yet tested | Planned for future coverage.      |

### Coverage Report

The coverage report for **Session-Service** has been generated using [Jacoco](https://www.jacoco.org/).  
You can find the HTML report in the `target/site/jacoco` directory or access it via the link below:

- [Session-Service Coverage Report](https://ajambor91.github.io/whispernet/reports/jacoco/test/html/index.html)


## Future Enhancements

Here are the planned improvements and features for WhisperNet:

1. **Fully Functional TURN Server**:
    - Deploy a fully operational TURN server (Coturn) to support WebRTC in restrictive network environments.

2. **Enhanced Test Coverage**:
    - Increase test coverage beyond 81% with additional unit, integration, and end-to-end tests.

3. **User Authentication**:
    - Add a another mariadb instance.
    - Add user authentication to session service.
    - Use Hibernate for secure and scalable user data management.
    - Implement authentication mechanisms such as JWT or OAuth2.

4. **PGP Key-Based User Verification**:
    - Allow users to verify the identity of their chat partners using PGP keys.

5. **Improved Monitoring and Performance Metrics**:
    - Add advanced metrics and alerts in Grafana for real-time system health tracking.
    - Integrate Prometheus for detailed performance monitoring and analysis.

6. **Mobile Application**:
    - Build a mobile-friendly version of the application using React Native.

7. **Desktop Application**:
    - Develop a desktop version of the application using Electron for a native-like experience.

8. **Group Chat Support** (Optional):
    - Extend the application to support multi-user group chats with dynamic room creation.
9. **zkSNARK Integration** (Optional):
    - Explore the possibility of using zkSNARKs for advanced cryptographic features, such as zero-knowledge proofs.

## Contributing ##
Feel free to open issues or submit pull requests. All contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and distribute it as long as the terms of the license are followed.
