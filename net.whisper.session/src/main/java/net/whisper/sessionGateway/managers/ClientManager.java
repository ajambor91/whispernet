package net.whisper.sessionGateway.managers;

import net.whisper.sessionGateway.dto.requests.PeerState;
import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPeerRole;
import net.whisper.sessionGateway.factories.ClientFactory;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
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
