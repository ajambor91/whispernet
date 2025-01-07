package net.whisper.wssession.session.factories;

import net.whisper.wssession.clients.models.ClientWithoutSession;
import net.whisper.wssession.session.models.PeerClient;

public class PeerFactory {
    public static PeerClient createPeerFromClient(ClientWithoutSession clientTemplate) {
        return new PeerClient(clientTemplate);
    }

}
