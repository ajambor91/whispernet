
package net.whisper.wssession;
import net.whisper.wssession.ConnectionStatus;
import net.whisper.wssession.Session;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Client {
    private String userToken;
    private ConnectionStatus connectionStatus;
    private Session session = new Session();

}