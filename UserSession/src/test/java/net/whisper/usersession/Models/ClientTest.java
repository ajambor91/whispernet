package net.whisper.usersession.Models;

import net.whisper.usersession.Enums.EClientConnectionStatus;
import net.whisper.usersession.Enums.EPeerRole;
import net.whisper.usersession.Utils.TestFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static net.whisper.usersession.Utils.TestFactory.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class ClientTest {
    @Test
    @DisplayName("Should set all fields using setters in empty constructor")
    public void testEmptyConstructorAndSetters() {
        Client client = TestFactory.createClient();
        assertEquals(TEST_SESSION_TOKEN, client.getSessionToken());
        assertEquals(TEST_USER_ID, client.getUserId());
        assertEquals(EPeerRole.INITIATOR, client.getPeerRole());
        assertEquals(TEST_USER_TOKEN, client.getUserToken());
        assertEquals(EClientConnectionStatus.CREATED, client.getClientConnectionStatus());

    }

}
