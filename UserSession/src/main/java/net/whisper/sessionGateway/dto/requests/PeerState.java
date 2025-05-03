package net.whisper.sessionGateway.dto.requests;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PeerState {
    private String sessionToken;
    private String peerRole;
    private String secretKey;
    private boolean isSigned;
    private String sessionAuthType;
}
