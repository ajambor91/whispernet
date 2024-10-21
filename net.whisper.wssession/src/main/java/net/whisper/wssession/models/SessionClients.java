package net.whisper.wssession;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;
import net.whisper.wssession.Session;
import net.whisper.wssession.Client;
@Getter
@Setter
public class SessionClients extends Session{
    private List<Client> clients = new ArrayList<>();
}