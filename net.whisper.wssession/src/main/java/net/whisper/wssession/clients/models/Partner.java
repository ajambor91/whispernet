package net.whisper.wssession.clients.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.wssession.clients.interfaces.IPartner;

@Getter
@Setter
public class Partner implements IPartner {
    private String username;

    public Partner(String username) {
        this.username = username;
    }
}
