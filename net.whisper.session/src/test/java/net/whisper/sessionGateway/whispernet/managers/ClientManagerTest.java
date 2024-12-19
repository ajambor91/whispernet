package net.whisper.sessionGateway.whispernet.managers;


import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPeerRole;
import net.whisper.sessionGateway.managers.ClientManager;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static net.whisper.sessionGateway.whispernet.utils.TestFactory.TEST_SESSION_TOKEN_JOINER;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class ClientManagerTest {

    private final ClientManager clientManager;


    @Autowired
    public ClientManagerTest(ClientManager clientManager) {
        this.clientManager = clientManager;
    }

    @Test
    @DisplayName("Should create joining client")
    public void shouldCreateJoiningClient() {
        Client createdClient = this.clientManager.createJoinClient(TEST_SESSION_TOKEN_JOINER);
        assertEquals(createdClient.getClientConnectionStatus(), EClientConnectionStatus.CREATED);
        assertEquals(createdClient.getPeerRole(), EPeerRole.JOINER);
    }

    @Test
    @DisplayName("Should create new client")
    public void shouldCreateNewClient() {
        ClientWithoutSession createdClient = this.clientManager.setupNewClient();
        assertEquals(createdClient.getPeerRole(), EPeerRole.INITIATOR);
        assertEquals(createdClient.getClientConnectionStatus(), EClientConnectionStatus.CREATED);
    }
}
