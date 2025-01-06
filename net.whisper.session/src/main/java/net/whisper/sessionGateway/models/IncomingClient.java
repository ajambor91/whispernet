package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IIncomingClient;

@Getter
@Setter
public class IncomingClient extends BaseClient implements IIncomingClient {
    String sessionToken;
    String secretKey;

    public IncomingClient() {

    }
}