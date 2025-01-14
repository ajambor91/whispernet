package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.ISignedClient;

@Getter
@Setter
public class SignedClientWithoutSession extends ClientWithoutSession implements ISignedClient {
    private boolean isConfirmed;
    private String jwt;
    private String username;

}
