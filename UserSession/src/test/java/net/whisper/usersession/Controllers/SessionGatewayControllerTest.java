package net.whisper.usersession.Controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import net.whisper.usersession.DTO.Requests.PeerState;
import net.whisper.usersession.Exceptions.ApprovalExisiting;
import net.whisper.usersession.Exceptions.UserUnauthorizationException;
import net.whisper.usersession.Models.BaseClient;
import net.whisper.usersession.Models.IncomingClient;
import net.whisper.usersession.Services.CookiesService;
import net.whisper.usersession.Services.SessionService;
import net.whisper.usersession.Utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static net.whisper.usersession.Utils.TestFactory.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SessionGatewayController.class)
public class SessionGatewayControllerTest {

    private final Integer cookieTimeToLive = 86400;
    @Autowired
    private MockMvc mockMvc;
    private PeerState peerState;
    @MockBean
    private SessionService sessionService;
    private Map<String, String> headers;
    @MockBean
    private CookiesService cookiesService;
    private IncomingClient mockClient;
    private IncomingClient joinerClient;
    private ObjectMapper objectMapper;
    private Cookie mockCookie;

    @BeforeEach
    public void setup() throws InterruptedException, JsonProcessingException, ApprovalExisiting {
        this.headers = TestFactory.createTestJoinHeaders();
        this.objectMapper = new ObjectMapper();
        this.joinerClient = TestFactory.createIncomingJoinerClient();
        this.mockClient = TestFactory.createIncomingClient();
        this.peerState = TestFactory.createJoinPeerState();
        this.mockCookie = TestFactory.createCookie(this.mockClient);
        when(cookiesService.getCookie(mockClient, this.cookieTimeToLive)).thenReturn(mockCookie);
        when(sessionService.createClient()).thenReturn(this.mockClient);
        when(sessionService.updateStatusAndGetPartners(
                any(String.class),
                any(String.class),
                any(Map.class),
                any(PeerState.class)
        )).thenReturn(this.mockClient);
        when(sessionService.createSignClient(any(Map.class))).thenReturn(this.mockClient);
        when(sessionService.createNextClientSession(eq(TEST_SESSION_TOKEN), any(Map.class))).thenReturn(this.mockClient);
        when(sessionService.updateClient(
                eq(TEST_USER_TOKEN_JOINER),
                eq(TEST_SESSION_TOKEN_JOINER),
                any(Map.class),
                any(PeerState.class)
        )).thenReturn(this.joinerClient);
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
                            "peerRole": "initiator",
                            "secretKey": "SECRET"
                        }
                        """))
                .andExpect(cookie().value("userToken", TEST_USER_TOKEN));
    }

    @Test
    @DisplayName("Should create a new session and return session details")
    public void testCreateNextClientSession() throws Exception {
        this.mockMvc.perform(post("/session/exists/{sessionToken}", TEST_SESSION_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "sessionToken": "7c944fc9-ad51-4392-bde2-f4b6126ea62e",
                            "peerRole": "initiator",
                              "secretKey": "SECRET"
                        }
                        """))
                .andExpect(cookie().value("userToken", TEST_USER_TOKEN));
    }

    @Test
    @DisplayName("Should return Unauthorize response when client is not verified in joining to session")
    public void testCreateNextClientSessionAndReturnUnauthorized() throws Exception {
        Cookie joinerCookie = TestFactory.createCookie(this.joinerClient);
        when(cookiesService.getCookie(any(BaseClient.class), anyInt())).thenReturn(joinerCookie);
        when(sessionService.createNextClientSession(
                any(String.class),
                any(Map.class)
        )).thenThrow(new UserUnauthorizationException("Client unauthorized", this.joinerClient));
        this.mockMvc.perform(post("/session/exists/{sessionToken}", TEST_SESSION_TOKEN_JOINER)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(content().json("""
                        {
                            "sessionToken": "8c08d064-abbc-4e7a-8818-1365a1fb27de",
                            "peerRole": "joiner"
                        }
                        """))
                .andExpect(cookie().value("userToken", TEST_USER_TOKEN_JOINER));
    }

    @Test
    @DisplayName("Should update a session and return session details")
    public void testUpdateSession() throws Exception {
        Cookie cookie = new Cookie("userToken", TEST_USER_TOKEN_JOINER);

        this.mockMvc.perform(put("/session/update/{sessionToken}", TEST_SESSION_TOKEN_JOINER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Joiner")
                        .header("authorization", "AuthKey")
                        .cookie(cookie)
                        .content(this.objectMapper.writeValueAsString(this.peerState)))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "sessionToken": "8c08d064-abbc-4e7a-8818-1365a1fb27de",
                            "peerRole": "joiner",
                              "secretKey": "SECRET"
                        }
                        """));
    }

    @Test
    @DisplayName("Should return Unauthorized response when update a session")
    public void testUpdateSessionNotAuthorized() throws Exception, ApprovalExisiting {
        Cookie cookie = new Cookie("userToken", TEST_USER_TOKEN_JOINER);
        when(sessionService.updateClient(
                eq(TEST_USER_TOKEN_JOINER),
                eq(TEST_SESSION_TOKEN_JOINER),
                any(Map.class),
                any(PeerState.class)
        )).thenThrow(UserUnauthorizationException.class);
        this.mockMvc.perform(put("/session/update/{sessionToken}", TEST_SESSION_TOKEN_JOINER)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Joiner")
                        .header("authorization", "AuthKey")
                        .cookie(cookie)
                        .content(this.objectMapper.writeValueAsString(this.peerState)))
                .andExpect(status().isUnauthorized())
        ;
    }

    @Test
    @DisplayName("Should create a new signed session and return session details")
    public void testCreateSignedSession() throws Exception {
        this.mockMvc.perform(post("/session/create-signed")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "sessionToken": "7c944fc9-ad51-4392-bde2-f4b6126ea62e",
                            "peerRole": "initiator",
                            "secretKey": "SECRET"
                        }
                        """))
                .andExpect(cookie().value("userToken", TEST_USER_TOKEN));
    }

    @Test
    @DisplayName("Should return Unauthorized response when throwing UserUnauthorizationException in create signed session")
    public void testCreateSignedSessionThrowUnauthorized() throws Exception {
        when(this.sessionService.createSignClient(any(Map.class))).thenThrow(UserUnauthorizationException.class);
        this.mockMvc.perform(post("/session/create-signed")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should update initiator status")
    public void testUpdateInitiatorStatus() throws Exception {
        this.mockMvc.perform(put("/session/update/initiator/{sessionToken}", TEST_SESSION_TOKEN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("username", "Initiator")
                        .header("authorization", "AuthKey")
                        .cookie(this.mockCookie)
                        .content(this.objectMapper.writeValueAsString(this.peerState))
                )
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                            "sessionToken": "7c944fc9-ad51-4392-bde2-f4b6126ea62e",
                            "peerRole": "initiator",
                            "secretKey": "SECRET"
                        }
                        """));
    }

}
