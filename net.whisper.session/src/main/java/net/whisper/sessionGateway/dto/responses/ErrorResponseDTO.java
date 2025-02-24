package net.whisper.sessionGateway.dto.responses;

import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.models.IncomingClient;

import java.util.Map;

@Getter
@Setter
public class ErrorResponseDTO extends ResponseDTO {


    private String message;

    public ErrorResponseDTO(IncomingClient incomingClient, String message) {
        super(incomingClient);
        this.message = message;
    }

    public ErrorResponseDTO(IBaseClient incomingClient, String sessionToken, String message) {
        super(incomingClient, sessionToken);
        this.message = message;
    }

    public ErrorResponseDTO(String message) {
        this.message = message;
    }

    @Override
    public Map<String, Object> toMap() {
        Map<String, Object> map = super.toMap();
        map.put("message", this.message);
        return map;
    }
}
