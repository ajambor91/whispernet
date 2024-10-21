package net.whisper.session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

import net.whisper.session.CookiesService;
import net.whisper.session.SessionService;
import net.whisper.session.KafkaService;
import net.whisper.session.Session;
import net.whisper.session.Client;
@RestController
@RequestMapping("/session")
public class SessionController {
    @Autowired
    SessionService sessionService;

    @Autowired
    KafkaService kafkaService;

    @Autowired
    CookiesService cookiesService;

    @Autowired
    private ObjectMapper objectMapper;


    @PostMapping("/create")
    public ResponseEntity<Map<String, String>> createSession(HttpServletResponse response) {
        try {
            Client client = sessionService.createClient();
            Cookie httpOnlyCookie = cookiesService.getCookie(client);
            Map<String, String> responseBody = Map.of("sessionToken", client.getSession().getSessionToken());
            response.addCookie(httpOnlyCookie);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/exists/{sessionToken}")
    public ResponseEntity<Map<String, String>> createNextClientSession(HttpServletResponse response, @PathVariable String sessionToken) {
        try {
            Client client = sessionService.createNextClientSession(sessionToken);
            Cookie httpOnlyCookie = cookiesService.getCookie(client);
            Map<String, String> responseBody = Map.of("sessionToken", client.getSession().getSessionToken());

            response.addCookie(httpOnlyCookie);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }

    }
}
