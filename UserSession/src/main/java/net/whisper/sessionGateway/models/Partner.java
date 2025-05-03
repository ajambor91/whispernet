package net.whisper.sessionGateway.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IPartner;

@Getter
@Setter
public class Partner implements IPartner {
    private String username;
    private String publicKey;

}
