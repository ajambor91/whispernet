package net.whisper.wssession.session.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.core.interfaces.IBaseClient;
import net.whisper.wssession.core.models.BaseClient;

@Getter
@Setter
public class PeerClient extends BaseClient {

    public PeerClient() {
    }

    public PeerClient(IBaseClient userClient) {
        super(userClient);
    }
}
