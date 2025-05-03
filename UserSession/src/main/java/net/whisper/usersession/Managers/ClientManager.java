package net.whisper.usersession.Managers;

import net.whisper.usersession.DTO.Requests.PeerState;
import net.whisper.usersession.Enums.EClientConnectionStatus;
import net.whisper.usersession.Enums.EPeerRole;
import net.whisper.usersession.Factories.ClientFactory;
import net.whisper.usersession.Models.Client;
import net.whisper.usersession.Models.ClientWithoutSession;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ClientManager {

    public Client createJoinClient(String sessionToken) {
        String userToken = UUID.randomUUID().toString();
        String userId = UUID.randomUUID().toString();
        return ClientFactory.createClient(userToken, userId, sessionToken, EPeerRole.JOINER, EClientConnectionStatus.CREATED);
    }

    public Client createUpdateClient(String userToken, PeerState peerState) {

        return ClientFactory.createClient(userToken, peerState);
    }

    public ClientWithoutSession setupNewClient() {
        String userToken = UUID.randomUUID().toString();
        String userId = UUID.randomUUID().toString();
        return ClientFactory.createClientWithoutSession(userToken, userId, EPeerRole.INITIATOR, EClientConnectionStatus.CREATED);
    }

}
