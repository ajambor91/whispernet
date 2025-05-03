package net.whisper.usersession.Managers;


import net.whisper.usersession.Enums.EClientConnectionStatus;
import net.whisper.usersession.Enums.EPeerRole;
import net.whisper.usersession.Models.Client;
import net.whisper.usersession.Models.ClientWithoutSession;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static net.whisper.usersession.Utils.TestFactory.TEST_SESSION_TOKEN_JOINER;
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
