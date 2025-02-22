package net.whisper.sessionGateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import net.whisper.sessionGateway.dto.responses.ErrorResponseDTO;
import net.whisper.sessionGateway.models.IncomingClient;
import net.whisper.sessionGateway.models.Partner;
import net.whisper.sessionGateway.services.CookiesService;
import net.whisper.sessionGateway.services.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
    public ResponseEntity<?> createSession(HttpServletResponse response) {
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
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
        }
    }

    @PostMapping("/exists/{sessionToken}")
    public ResponseEntity<?> createNextClientSession(HttpServletResponse response, @PathVariable String sessionToken) {
        logger.info("Received request to check if session exists: sessionToken={}", sessionToken);
        try {
            IncomingClient client = sessionService.createNextClientSession(sessionToken);
            logger.debug("Created next client session: sessionToken={}, peerRole={}", client.getSessionToken(), client.getPeerRole().getPeerRoleName());

            Cookie httpOnlyCookie = cookiesService.getCookie(client, 86400);
            logger.debug("Generated HTTP-only cookie for existing session: {}", httpOnlyCookie);
            List<Partner> partners = new ArrayList<>();

            Map<String, Object> responseBody = new HashMap<String, Object>(Map.of("sessionToken", client.getSessionToken(),
                    "peerRole", client.getPeerRole().getPeerRoleName(),
                    "secretKey", client.getSecretKey(),
                    "sessionAuthType", client.getSessionType().getSessionPGPStatus()));
            if (client.getPartners() != null) {
                partners.addAll(client.getPartners());
                Object[] partnersMap = partners.stream().map(partner -> {
                    return Map.of(
                            "publicKey", partner.getPublicKey(),
                            "username", partner.getUsername()
                    );
                }).toArray();
                responseBody.put("partners", partnersMap);

            }
            response.addCookie(httpOnlyCookie);
            logger.info("Existing session validation successful: responseBody={}", responseBody);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);

        } catch (Exception e) {
            logger.error("Error while validating existing session: sessionToken={}", sessionToken, e);
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
        }
    }


    @PostMapping("/create-signed")
    public ResponseEntity<?> createSignedSession(@RequestHeader Map<String, String> headers, HttpServletResponse response) {
        logger.info("Received request to create a new session");
        try {
            IncomingClient client = sessionService.createSignClient(headers);
            logger.debug("Created new client: sessionToken={}, peerRole={}", client.getSessionToken(), client.getPeerRole().getPeerRoleName());

            Cookie httpOnlyCookie = cookiesService.getCookie(client, 86400);
            logger.debug("Generated HTTP-only cookie: {}", httpOnlyCookie);

            Map<String, String> responseBody = Map.of(
                    "sessionToken", client.getSessionToken(),
                    "peerRole", client.getPeerRole().getPeerRoleName(),
                    "secretKey", client.getSecretKey(),
                    "sessionAuthType", client.getSessionType().getSessionPGPStatus()

            );

            response.addCookie(httpOnlyCookie);
            logger.info("Session creation successful: responseBody={}", responseBody);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);

        } catch (NoSuchElementException e) {
            logger.error("Handle error while creating signed session", e.getMessage());
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.badRequest().body(errorResponseDTO);
        } catch (JsonProcessingException | InterruptedException e) {
            logger.error("Handle error while creating signed session", e.getMessage());
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
        } catch (SecurityException e) {
            logger.error("Handle error while creating signed session", e.getMessage());
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponseDTO);
        }
    }
}
