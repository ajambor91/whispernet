package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Interfaces.IIncomingClient;

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