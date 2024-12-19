package net.whisper.wssession.clients.factories;

import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.templates.KafkaClientMessage;
import net.whisper.wssession.clients.templates.KafkaClientWithoutSessionMessage;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;

public class ClientFactory {
    public static PeerClient createPeerClient(KafkaClientWithoutSessionMessage clientWithoutSession) {
        return new PeerClient(clientWithoutSession);
    }

    public static PeerClient createPeerClient(KafkaClientMessage client) {
        return new PeerClient(client);
    }

    public static Client createClientFromPeerSesion(PeerSession peerSession, PeerClient peerClient) {
        return new Client(peerClient, peerSession);


    }


    //TODO
//    public static KafkaClientMessage clientKafkaMessage()
}
