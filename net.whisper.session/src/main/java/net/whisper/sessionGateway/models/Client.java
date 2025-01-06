package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IClient;

@Getter
@Setter
public class Client extends BaseClient implements IClient {
    String sessionToken;

    public Client() {

    }


}