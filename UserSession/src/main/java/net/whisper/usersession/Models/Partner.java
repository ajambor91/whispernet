package net.whisper.usersession.Models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Interfaces.IPartner;

@Getter
@Setter
public class Partner implements IPartner {
    private String username;
    private String publicKey;

}
