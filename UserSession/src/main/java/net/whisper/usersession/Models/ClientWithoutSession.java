package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Interfaces.IClientWithoutSession;

@Getter
@Setter
public class ClientWithoutSession extends BaseClient implements IClientWithoutSession {
    public ClientWithoutSession() {
    }
}