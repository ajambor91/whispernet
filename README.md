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

---

## Tech Stack

- **Backend**:
    - Spring Boot microservices:
        - **Session**: Handles user creation and management.
        - **WSSession**: Creates and manages WebRTC sessions.
    - Node.js microservice:
        - **WebSocket Service**: Pairs users for communication.
    - Kafka: Handles asynchronous communication between microservices.
    - Redis: Stores session data for quick access.

- **Frontend**:
    - React: A modern, responsive UI for the chat platform.

- **Infrastructure**:
    - Grafana + Loki + Promtail: For real-time monitoring and logging.
    - Docker: Containerized deployment of all services.
    - TURN Server: Coturn server for WebRTC signaling (currently in testing).

---

## Architecture Overview

### System Diagram


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

---

### Steps to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ajambor91/whispernet.git
   cd whispernet
   ```
2. **Run containers stack**
    ```bash
    docker-compose build
    docker-compose up -d
   ```
 3. **Run frontend app**
    ```bash
    cd ui/web
    npm run install or yarn install
    npm run start 

Open http://localhost:3001 in web browser, tested in Chromium based browsers like Chrome, Edge etc.

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

2. **WebAssembly for Encryption**:
    - Integrate WebAssembly (C++) for fast and secure message encryption and decryption.

3. **Enhanced Test Coverage**:
    - Increase test coverage beyond 81% with additional unit, integration, and end-to-end tests.

4. **User Authentication**:
    - Add a dedicated **Authentication microservice** built with Spring Boot.
    - Use MariaDB with Hibernate for secure and scalable user data management.
    - Implement authentication mechanisms such as JWT or OAuth2.

5. **PGP Key-Based User Verification**:
    - Allow users to verify the identity of their chat partners using PGP keys.

6. **Improved Monitoring and Performance Metrics**:
    - Add advanced metrics and alerts in Grafana for real-time system health tracking.
    - Integrate Prometheus for detailed performance monitoring and analysis.

7. **Mobile Application**:
    - Build a mobile-friendly version of the application using React Native.

8. **Desktop Application**:
    - Develop a desktop version of the application using Electron for a native-like experience.

9. **Group Chat Support** (Optional):
    - Extend the application to support multi-user group chats with dynamic room creation.

10. **zkSNARK Integration** (Optional):
    - Explore the possibility of using zkSNARKs for advanced cryptographic features, such as zero-knowledge proofs.

## Contributing ##
Feel free to open issues or submit pull requests. All contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and distribute it as long as the terms of the license are followed.
