package net.whisper.wssession.session.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.core.enums.EPGPSessionType;
import net.whisper.wssession.core.interfaces.IBaseClient;
import net.whisper.wssession.core.models.BaseSession;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class PeerSession extends BaseSession {
    private List<PeerClient> peerClients = new ArrayList<>();
    private String secretKey;

    public PeerSession() {
    }

    public PeerSession(String sessionToken, String secretKey, EPGPSessionType sessionType) {
        super(sessionToken);
        this.secretKey = secretKey;
        this.setSessionType(sessionType);
    }

    public void addPeerClient(PeerClient peerClient) {
        if (peerClients.stream().noneMatch(existingPeer -> existingPeer.getUserId().equals(peerClient.getUserId()))) {
            peerClients.add(peerClient);
        } else {
            throw new IllegalArgumentException(String.format("PeerClient is duplicated when adding to session, sessionToken=%s", this.sessionToken));
        }
    }

    public List<PeerClient> getPartnersPeers(IBaseClient client) {
        return peerClients.stream().filter(partner -> !partner.getUserId().equals(client.getUserId())).toList();
    }

    private void setSessionType(EPGPSessionType sessionType) {
        if (sessionType == null || sessionType == EPGPSessionType.UNSIGNED) {
            this.setPgpSessionType(EPGPSessionType.UNSIGNED);
        } else if (sessionType == EPGPSessionType.CHECK_RESPONDER) {
            this.setPgpSessionType(EPGPSessionType.CHECK_RESPONDER);
        } else if (sessionType == EPGPSessionType.WAITING_FOR_SIGNED) {
            this.setPgpSessionType(EPGPSessionType.SIGNED);
        } else if (sessionType == EPGPSessionType.SIGNED_INITIATOR) {
            this.setPgpSessionType(EPGPSessionType.SIGNED_INITIATOR);
        }
    }


}