package net.whisper.security.dto.responses;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {

    private String username;
    private String message;
    public LoginResponseDTO(String username, String message) {
        this.username = username;
        this.message = message;
    }
}
