package net.whisper.sessionGateway.whispernet.controllers;

import jakarta.servlet.http.Cookie;
import net.whisper.sessionGateway.controllers.SessionGatewayController;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.services.CookiesService;
import net.whisper.sessionGateway.services.SessionService;
import net.whisper.sessionGateway.whispernet.utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static net.whisper.sessionGateway.whispernet.utils.TestFactory.TEST_SESSION_TOKEN;
import static net.whisper.sessionGateway.whispernet.utils.TestFactory.TEST_USER_TOKEN;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SessionGatewayController.class)
public class SessionGatewayControllerTest {

    private final Integer cookieTimeToLive = 86400;
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SessionService sessionService;

    @MockBean
    private CookiesService cookiesService;

    private Client mockClient;

    private Cookie mockCookie;

    @BeforeEach
    public void setup() {
        this.mockClient = TestFactory.createClient();
        this.mockCookie = TestFactory.createCookie(this.mockClient);
        when(cookiesService.getCookie(mockClient, this.cookieTimeToLive)).thenReturn(mockCookie);
        when(sessionService.createClient()).thenReturn(this.mockClient);
        when(sessionService.createNextClientSession(TEST_SESSION_TOKEN)).thenReturn(this.mockClient);
    }

    @Test
    @DisplayName("Should create a new session and return session details")
    public void testCreateSession() throws Exception {
        this.mockMvc.perform(post("/session/create")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "sessionToken": "7c944fc9-ad51-4392-bde2-f4b6126ea62e",
                            "peerRole": "initiator"
                        }
                        """))
                .andExpect(cookie().value("userToken", TEST_USER_TOKEN));
    }

    @Test
    @DisplayName("Should create a new session and return session details")
    public void testCreateNextClientSessionn() throws Exception {
        this.mockMvc.perform(post("/session/exists/{sessionToken}", TEST_SESSION_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "sessionToken": "7c944fc9-ad51-4392-bde2-f4b6126ea62e",
                            "peerRole": "initiator"
                        }
                        """))
                .andExpect(cookie().value("userToken", TEST_USER_TOKEN));
    }

}