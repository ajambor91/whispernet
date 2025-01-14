package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IBasicClient;

@Getter
@Setter
public class BasicClient implements IBasicClient {

    private String userToken;
    private String userId;
}
