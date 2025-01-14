package net.whisper.security.dto.responses;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {

    public LoginResponseDTO(String username, String message) {
        this.username = username;
        this.message = message;
    }
    private String username;
    private String message;
}
