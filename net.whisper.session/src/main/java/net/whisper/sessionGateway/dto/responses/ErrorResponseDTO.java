package net.whisper.sessionGateway.dto.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponseDTO {


    private String message;

    public ErrorResponseDTO() {}

    public ErrorResponseDTO(String message) {
        this.message = message;
    }
}
