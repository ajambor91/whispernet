package net.whisper.security.dto.requests;


import lombok.Getter;
import lombok.Setter;
import net.whisper.security.adnotations.ValidRegister;

@Setter
@Getter
@ValidRegister
public class RegisterDTO {

    private String username;
    private String stringKey;
    private String stringFile;

}
