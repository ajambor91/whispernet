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
            TokenWithSessionTemplate token = sessionService.createUserSession();
            Cookie httpOnlyCookie = cookiesService.getCookie(token);
            Map<String, String> responseBody = Map.of("sessionToken", token.getWSessionToken());
            response.addCookie(httpOnlyCookie);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);
        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/exists/{wsToken}")
    public ResponseEntity<Map<String, String>> createSessionForExixts(HttpServletResponse response, @PathVariable String wsToken) {
        try {
            TokenWithSessionTemplate token = sessionService.createUserSessionForExistingWSession(wsToken);
            Cookie httpOnlyCookie = cookiesService.getCookie(token);
            Map<String, String> responseBody = Map.of("sessionToken", token.getWSessionToken());

            response.addCookie(httpOnlyCookie);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(responseBody);        } catch (java.lang.Exception e) {
            throw new RuntimeException(e);
        }

    }
}
