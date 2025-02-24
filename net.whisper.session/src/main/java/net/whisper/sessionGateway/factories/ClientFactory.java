package net.whisper.sessionGateway.factories;

import net.whisper.sessionGateway.dto.requests.PeerState;
import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPGPSessionType;
import net.whisper.sessionGateway.enums.EPeerRole;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;

public class ClientFactory {
    public static Client createClient(String userToken, String userId, String sessionToken, EPeerRole peerRole, EClientConnectionStatus connectionStatus) {
        Client client = new Client();
        client.setUserToken(userToken);
        client.setUserId(userId);
        client.setPeerRole(peerRole);
        client.setClientConnectionStatus(connectionStatus);
        client.setSessionToken(sessionToken);
        return client;
    }

    public static Client createClient(String userToken, PeerState peerState) {
        Client client = new Client();
        client.setUserToken(userToken);
        client.setPeerRole(EPeerRole.fromValue(peerState.getPeerRole()));
        client.setSessionToken(peerState.getSessionToken());
        client.setSessionType(EPGPSessionType.fromValue(peerState.getSessionAuthType()));
        return client;
    }

    public static ClientWithoutSession createClientWithoutSession(String userToken, String userId, EPeerRole peerRole, EClientConnectionStatus connectionStatus) {
        ClientWithoutSession client = new ClientWithoutSession();
        client.setUserToken(userToken);
        client.setPeerRole(peerRole);
        client.setUserId(userId);
        client.setClientConnectionStatus(connectionStatus);
        return client;
    }
}
