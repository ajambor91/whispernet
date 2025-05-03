package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Interfaces.ISignedClient;

@Getter
@Setter
public class SignedClientWithoutSession extends ClientWithoutSession implements ISignedClient {
    private String jwt;
    private String username;

}
