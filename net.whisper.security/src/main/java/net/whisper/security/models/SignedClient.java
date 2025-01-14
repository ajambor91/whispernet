package net.whisper.security.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.security.interfaces.IBaseClient;
import net.whisper.security.interfaces.ISignedClient;

@Getter
@Setter
public class SignedClient extends BaseClient implements IBaseClient, ISignedClient {
    private boolean confirmed;
    private String jwt;
    private String username;
    public SignedClient() {

    }
}