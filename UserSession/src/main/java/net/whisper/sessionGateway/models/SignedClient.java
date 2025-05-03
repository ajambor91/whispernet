package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.ISignedClient;

@Getter
@Setter
public class SignedClient extends Client implements ISignedClient {
    private String jwt;
    private String username;


}
