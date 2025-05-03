package net.whisper.security.dto.requests;


import lombok.Getter;
import lombok.Setter;
import net.whisper.security.adnotations.ValidLogin;

@Getter
@Setter
@ValidLogin
public class LoginMessageDTO {
    private String username;
    private String message;
    private String signedMessage;
    private String signedMessageFile;

}
