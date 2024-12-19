package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IClientWithoutSession;

@Getter
@Setter
public class ClientWithoutSession extends BaseClient implements IClientWithoutSession {

}