package net.whisper.session.Clients.Factories;


import net.whisper.session.Clients.Models.Client;
import net.whisper.session.Clients.Models.ClientWithoutSession;
import net.whisper.session.Session.Models.PeerClient;
import net.whisper.session.Session.Models.PeerSession;

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
