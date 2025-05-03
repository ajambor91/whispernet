package net.whisper.session.Clients.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.session.Clients.Interfaces.IPartner;

@Getter
@Setter
public class Partner implements IPartner {
    private String username;

    public Partner(String username) {
        this.username = username;
    }
}
