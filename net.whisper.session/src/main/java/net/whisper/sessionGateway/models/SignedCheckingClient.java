package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.enums.EPGPSessionType;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.interfaces.ISignedClient;

@Getter
@Setter
public class SignedCheckingClient extends BasicClient implements ISignedClient {
    private String jwt;
    private String username;

    public SignedCheckingClient() {

    }

    public SignedCheckingClient(IBaseClient clientWithoutSession, String jwt, String username) {
        this.setUserToken(clientWithoutSession.getUserToken());
        this.setUserId(clientWithoutSession.getUserId());
        this.setJwt(jwt);
        this.setUsername(username);
        this.setSessionType(EPGPSessionType.UNSIGNED);
    }
}