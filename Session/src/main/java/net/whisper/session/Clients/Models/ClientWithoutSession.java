package net.whisper.session.Clients.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.session.Clients.Interfaces.IClientWithoutSession;

@Getter
@Setter
public class ClientWithoutSession extends BaseClient implements IClientWithoutSession {
    public ClientWithoutSession() {
    }
}