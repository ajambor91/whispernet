package net.whisper.security.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.security.interfaces.IPartner;

@Getter
@Setter
public class Partner implements IPartner {
    private String username;
    private String publicKey;


}
