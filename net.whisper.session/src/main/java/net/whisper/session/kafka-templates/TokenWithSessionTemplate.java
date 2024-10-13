package net.whisper.session;
import net.whisper.session.TokenTemplate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenWithSessionTemplate extends TokenTemplate {
    private String wSessionToken;

}