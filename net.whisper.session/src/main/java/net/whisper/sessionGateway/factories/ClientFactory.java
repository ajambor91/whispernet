package net.whisper.sessionGateway.factories;

import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPeerRole;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import net.whisper.sessionGateway.templates.KafkaClientMessage;

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

    public static ClientWithoutSession createClientWithoutSession(String userToken, String userId, EPeerRole peerRole, EClientConnectionStatus connectionStatus) {
        ClientWithoutSession client = new ClientWithoutSession();
        client.setUserToken(userToken);
        client.setPeerRole(peerRole);
        client.setUserId(userId);
        client.setClientConnectionStatus(connectionStatus);
        return client;
    }

    public static Client createClientFromTemplate(KafkaClientMessage kafkaClientMessage) {
        return new Client(kafkaClientMessage);
    }
}
