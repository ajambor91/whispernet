package net.whisper.wssession;

import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class TokenCreatedWSession {
    private String wsSessionToken;
    private List<String> usersTokens = new ArrayList<>();
}