package net.whisper.session.Clients.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.session.Clients.Interfaces.IClient;
import net.whisper.session.Core.Enums.EPGPSessionType;
import net.whisper.session.Session.Models.PeerClient;
import net.whisper.session.Session.Models.PeerSession;


import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
public class Client extends BaseClient implements IClient {
    private String sessionToken;
    private String secretKey;
    private String username;
    private List<Partner> partners;

    public Client() {

    }

    public Client(PeerClient peerClient, PeerSession peerSession) {
        super(peerClient);
        this.sessionToken = peerSession.getSessionToken();
        this.secretKey = peerSession.getSecretKey();
        this.setSessionType(peerSession.getPgpSessionType());
        this.partners = peerClient.getSessionType() == EPGPSessionType.UNSIGNED ?
                new ArrayList<>() :
                peerSession.getPartnersPeers(this).stream().map(partner -> new Partner(partner.getUsername())).toList();
    }
}