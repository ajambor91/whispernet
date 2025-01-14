package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPeerRole;
import net.whisper.sessionGateway.interfaces.IBaseClient;


@Getter
@Setter
public abstract class BaseClient extends BasicClient implements IBaseClient {

    private EClientConnectionStatus clientConnectionStatus;
    private EPeerRole peerRole;

    public BaseClient() {

    }
}
