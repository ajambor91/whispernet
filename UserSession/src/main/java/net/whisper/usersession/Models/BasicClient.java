package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Enums.EPGPSessionType;
import net.whisper.usersession.Interfaces.IBasicClient;

@Getter
@Setter
public class BasicClient implements IBasicClient {
    private EPGPSessionType sessionType;
    private String userToken;
    private String userId;
    private String username;
}
