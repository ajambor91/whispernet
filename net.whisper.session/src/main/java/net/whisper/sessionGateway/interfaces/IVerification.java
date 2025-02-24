package net.whisper.sessionGateway.interfaces;

import java.util.List;

public interface IVerification {
    List<IVerificationPeer> getPeers();

    String getInitiatorId();
}
