package net.whisper.wssession.clients.services;

import net.whisper.wssession.clients.factories.ClientFactory;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.models.ClientWithoutSession;
import net.whisper.wssession.core.coordinatos.ClientSessionCoordinator;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.utils.TestFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@SpringBootTest(properties = {
        "spring.kafka.bootstrap-servers=localhost:9095",
        "spring.kafka.consumer.auto-offset-reset=earliest",
        "spring.kafka.listener.missing-topics-fatal=false"
})
public class ClientsServiceTest {


    private final ClientsService clientsService;

    @SpyBean
    private ClientSessionCoordinator clientSessionCoordinator;

    private ClientWithoutSession clientWithoutSession;
    private Client client;

    @Autowired
    public ClientsServiceTest(ClientsService clientsService) {
        this.clientsService = clientsService;
    }

    @BeforeEach
    public void setup() {
        this.client = TestFactory.createClient();
        this.clientWithoutSession = TestFactory.createClientWihtoutSession();
    }

    @Test
    @DisplayName("should process new client")
    public void prcessNewClientPass() {
        PeerClient peerClient = ClientFactory.createPeerClient(this.clientWithoutSession);
        this.clientsService.processNewClient(this.clientWithoutSession);
        verify(this.clientSessionCoordinator).processClientWithoutSession(any(PeerClient.class));
    }

    @Test
    @DisplayName("should throw exception when client is null - processNewClient")
    public void prcessNewClientException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            this.clientsService.processNewClient(null);
        });
        assertEquals("ClientWithoutSession cannot be null", exception.getMessage());
    }

    @Test
    @DisplayName("Should process joining client")
    public void processJoiningClientPass() {
        this.clientsService.processJoiningClient(this.client);
        PeerClient peerClient = ClientFactory.createPeerClient(this.client);
        verify(this.clientSessionCoordinator).processClient(eq(this.client.getSessionToken()), any(PeerClient.class));
    }

    @Test
    @DisplayName("Should throw exception when client is null - processJoiningClient")
    public void processJoiningClientException() {
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            this.clientsService.processJoiningClient(null);
        });
        assertEquals("Client cannot be null", exception.getMessage());
    }
}
