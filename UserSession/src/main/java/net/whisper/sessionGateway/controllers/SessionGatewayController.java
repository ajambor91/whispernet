package net.whisper.sessionGateway.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import net.whisper.sessionGateway.dto.requests.PeerState;
import net.whisper.sessionGateway.dto.responses.ErrorResponseDTO;
import net.whisper.sessionGateway.dto.responses.ResponseDTO;
import net.whisper.sessionGateway.exceptions.ApprovalExisiting;
import net.whisper.sessionGateway.exceptions.UserUnauthorizationException;
import net.whisper.sessionGateway.models.IncomingClient;
import net.whisper.sessionGateway.services.CookiesService;
import net.whisper.sessionGateway.services.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

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
            Map<String, Object> responseBody = new ResponseDTO(client).toMap();
            logger.debug("Session response created successful: responseBody={}", responseBody.toString());
            response.addCookie(httpOnlyCookie);
            logger.debug("Added cookie: sessionToken={}, userToken={}", client.getSessionToken(), client.getUserToken());
            logger.info("Session creation successful: sessionToken={}", client.getSessionToken());
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
    public ResponseEntity<?> createNextClientSession(HttpServletResponse response, @RequestHeader Map<String, String> headers, @PathVariable String sessionToken) {
        logger.info("Received request to join to session: sessionToken={}", sessionToken);
        try {
            IncomingClient client = sessionService.createNextClientSession(sessionToken, headers);
            logger.debug("Created next client session: sessionToken={}, peerRole={}", client.getSessionToken(), client.getPeerRole().getPeerRoleName());
            Cookie httpOnlyCookie = cookiesService.getCookie(client, 86400);
            logger.debug("Generated HTTP-only cookie for existing session: {}", httpOnlyCookie);
            Map<String, Object> responseBody = new ResponseDTO(client).toMap();
            logger.debug("Join session response created successful: responseBody={}", responseBody.toString());
            response.addCookie(httpOnlyCookie);
            logger.debug("Added cookie: sessionToken={}, userToken={}", client.getSessionToken(), client.getUserToken());
            logger.info("Peer has joined to session: sessionToken={}, userToken={}", client.getSessionToken(), client.getUserToken());
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);
        } catch (UserUnauthorizationException exception) {
            logger.error("Client unauthorized when tried join to signed session, sessionToken={}", sessionToken, exception);
            ErrorResponseDTO errorResponseDTO;
            if (exception.getClient() != null) {
                errorResponseDTO = new ErrorResponseDTO(exception.getClient(), sessionToken, exception.getMessage());

            } else {
                errorResponseDTO = new ErrorResponseDTO(sessionToken, exception.getMessage());
            }
            logger.debug("Join session response after unauthorized error created successful: responseBody={}", errorResponseDTO);
            Cookie httpOnlyCookie = cookiesService.getCookie(exception.getClient(), 86400);
            response.addCookie(httpOnlyCookie);
            logger.debug("Added cookie to unauthorized error response: userToken={}", exception.getClient().getUserToken());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponseDTO.toMap());
        } catch (Exception e) {
            logger.error("Error while validating existing session: sessionToken={}", sessionToken, e);
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
        }
    }

    @PutMapping("/update/{sessionToken}")
    public ResponseEntity<?> updateClientSession(@CookieValue(value = "userToken") String userToken, @RequestBody PeerState peerState, @RequestHeader Map<String, String> headers, @PathVariable String sessionToken) {
        logger.info("Received request to update peer in existing session: sessionToken={}, userToken={}", sessionToken, userToken);
        try {
            IncomingClient client = sessionService.updateClient(userToken, sessionToken, headers, peerState);
            logger.debug("Updated peer in signed session,  sessionToken={}, peerRole={}", client.getSessionToken(), client.getPeerRole().getPeerRoleName());
            Map<String, Object> responseBody = new ResponseDTO(client).toMap();
            logger.debug("Update session response created successful: responseBody={}", responseBody.toString());
            logger.info("Update peer session validation successful: responseBody={}", responseBody);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);
        } catch (ApprovalExisiting exisiting) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(exisiting.getMessage());
            return ResponseEntity.badRequest().body(errorResponseDTO);
        } catch (UserUnauthorizationException exception) {
            logger.error("Client unauthorized when tried join to signed session, sessionToken={}", sessionToken, exception);
            ErrorResponseDTO errorResponseDTO;
            if (exception.getClient() != null) {
                errorResponseDTO = new ErrorResponseDTO(exception.getClient(), sessionToken, exception.getMessage());

            } else {
                errorResponseDTO = new ErrorResponseDTO(sessionToken, exception.getMessage());
            }
            logger.debug("Update session response after unauthorized error created successful: responseBody={}", errorResponseDTO);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponseDTO.toMap());
        } catch (Exception e) {
            logger.error("Error while validating signed session: sessionToken={}", sessionToken, e);
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponseDTO);
        }
    }

    @PostMapping("/create-signed")
    public ResponseEntity<?> createSignedSession(@RequestHeader Map<String, String> headers, HttpServletResponse response) {
        logger.info("Received request to create a new signed session");
        try {
            IncomingClient client = sessionService.createSignClient(headers);
            logger.debug("Created new client for signed session: sessionToken={}, peerRole={}", client.getSessionToken(), client.getPeerRole().getPeerRoleName());

            Cookie httpOnlyCookie = cookiesService.getCookie(client, 86400);
            logger.debug("Generated HTTP-only cookie: {} for signed session", httpOnlyCookie);

            Map<String, Object> responseBody = new ResponseDTO(client).toMap();
            logger.debug("Signed session response created successful: responseBody={}", responseBody.toString());
            response.addCookie(httpOnlyCookie);
            logger.debug("Added cookie to signed session: sessionToken={}, userToken={}", client.getSessionToken(), client.getUserToken());

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
        } catch (UserUnauthorizationException e) {
            logger.error("Handle error while creating signed session", e.getMessage());
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponseDTO);
        }
    }

    @PutMapping("/update/initiator/{sessionToken}")
    public ResponseEntity<?> updateInitiatorStatus(@CookieValue(value = "userToken") String userToken, @RequestHeader Map<String, String> headers, @RequestBody PeerState peerState, @PathVariable String sessionToken) {
        logger.info("Received update initiator message, sessionToken={}, userToken={}", peerState.getSessionToken(), userToken);
        try {
            IncomingClient incomingClient = this.sessionService.updateStatusAndGetPartners(userToken, sessionToken, headers, peerState);
            Map<String, Object> reponseData = new ResponseDTO(incomingClient).toMap();
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(reponseData);
        } catch (ApprovalExisiting exisiting) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(exisiting.getMessage());
            return ResponseEntity.badRequest().body(errorResponseDTO);
        } catch (JsonProcessingException | InterruptedException e) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponseDTO);
        }
    }
}
