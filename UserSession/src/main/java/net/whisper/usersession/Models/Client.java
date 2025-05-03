package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Interfaces.IClient;

@Getter
@Setter
public class Client extends BaseClient implements IClient {
    private String sessionToken;

    public Client() {

    }


}