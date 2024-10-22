
package net.whisper.session;
import net.whisper.session.ConnectionStatus;
import net.whisper.session.Session;
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