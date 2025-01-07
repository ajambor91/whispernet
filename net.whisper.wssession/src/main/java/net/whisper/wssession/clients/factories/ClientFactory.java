package net.whisper.wssession.clients.factories;

import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.models.ClientWithoutSession;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;

public class ClientFactory {
    public static PeerClient createPeerClient(ClientWithoutSession clientWithoutSession) {
        return new PeerClient(clientWithoutSession);
    }

    public static PeerClient createPeerClient(Client client) {
        return new PeerClient(client);
    }

    public static Client createClientFromPeerSesion(PeerSession peerSession, PeerClient peerClient) {
        return new Client(peerClient, peerSession);


    }
}
