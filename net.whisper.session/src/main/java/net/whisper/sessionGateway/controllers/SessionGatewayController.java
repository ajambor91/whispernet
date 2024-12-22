package net.whisper.sessionGateway.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import net.whisper.sessionGateway.models.IncomingClient;
import net.whisper.sessionGateway.services.CookiesService;
import net.whisper.sessionGateway.services.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/session")
public class SessionGatewayController {

    private final Logger logger;
    private final SessionService sessionService;
    private final CookiesService cookiesService;

    @Autowired
    public SessionGatewayController(CookiesService cookiesService, SessionService sessionService) {
        this.sessionService = sessionService;
        this.cookiesService = cookiesService;
        this.logger = LoggerFactory.getLogger(SessionGatewayController.class);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createSession(HttpServletResponse response) {
        logger.info("Received request to create a new session");
        try {
            IncomingClient client = sessionService.createClient();
            logger.debug("Created new client: sessionToken={}, peerRole={}", client.getSessionToken(), client.getPeerRole().getPeerRoleName());

            Cookie httpOnlyCookie = cookiesService.getCookie(client, 86400);
            logger.debug("Generated HTTP-only cookie: {}", httpOnlyCookie);

            Map<String, String> responseBody = Map.of(
                    "sessionToken", client.getSessionToken(),
                    "peerRole", client.getPeerRole().getPeerRoleName(),
                    "secretKey", client.getSecretKey()
            );

            response.addCookie(httpOnlyCookie);
            logger.info("Session creation successful: responseBody={}", responseBody);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);

        } catch (Exception e) {
            logger.error("Error while creating session", e);
            throw new RuntimeException("Failed to create session", e);
        }
    }

    @PostMapping("/exists/{sessionToken}")
    public ResponseEntity<Map<String, String>> createNextClientSession(HttpServletResponse response, @PathVariable String sessionToken) {
        logger.info("Received request to check if session exists: sessionToken={}", sessionToken);
        try {
            IncomingClient client = sessionService.createNextClientSession(sessionToken);
            logger.debug("Created next client session: sessionToken={}, peerRole={}", client.getSessionToken(), client.getPeerRole().getPeerRoleName());

            Cookie httpOnlyCookie = cookiesService.getCookie(client, 86400);
            logger.debug("Generated HTTP-only cookie for existing session: {}", httpOnlyCookie);

            Map<String, String> responseBody = Map.of(
                    "sessionToken", client.getSessionToken(),
                    "peerRole", client.getPeerRole().getPeerRoleName(),
                    "secretKey", client.getSecretKey()

            );

            response.addCookie(httpOnlyCookie);
            logger.info("Existing session validation successful: responseBody={}", responseBody);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);

        } catch (Exception e) {
            logger.error("Error while validating existing session: sessionToken={}", sessionToken, e);
            throw new RuntimeException("Failed to validate session", e);
        }
    }
}
