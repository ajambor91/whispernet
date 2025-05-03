package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IIncomingClient;

import java.util.List;

@Getter
@Setter
public class IncomingClient extends BaseClient implements IIncomingClient {
    String sessionToken;
    String secretKey;
    private List<Partner> partners;

    public IncomingClient() {

    }
}