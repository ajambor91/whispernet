package net.whisper.wssession;
import net.whisper.wssession.TokenTemplate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenWithSessionTemplate extends TokenTemplate {
    private String wSessionToken;

}