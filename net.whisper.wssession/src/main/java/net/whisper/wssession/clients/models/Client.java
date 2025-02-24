package net.whisper.wssession.clients.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.clients.interfaces.IClient;
import net.whisper.wssession.core.enums.EPGPSessionType;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;

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