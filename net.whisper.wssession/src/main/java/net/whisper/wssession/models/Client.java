
package net.whisper.wssession;
import net.whisper.wssession.ConnectionStatus;
import net.whisper.wssession.PeerRole;

import net.whisper.wssession.Session;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Client {
    private String userToken;
    private String connectionStatus;
    private Session session = new Session();
    private String peerRole;

}