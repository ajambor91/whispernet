package net.whisper.session.Session.Factories;


import net.whisper.session.Clients.Models.ClientWithoutSession;
import net.whisper.session.Session.Models.PeerClient;

public class PeerFactory {
    public static PeerClient createPeerFromClient(ClientWithoutSession clientTemplate) {
        return new PeerClient(clientTemplate);
    }

}
