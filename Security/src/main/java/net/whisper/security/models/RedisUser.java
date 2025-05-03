package net.whisper.security.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.security.enums.ELoginStage;

@Setter
@Getter
public class RedisUser {
    private String username;
    private String publicKey;
    private ELoginStage stage;
    private String jwt;

    public RedisUser() {
    }

    public RedisUser(String username, String publicKey, ELoginStage stage) {
        this.publicKey = publicKey;
        this.username = username;
        this.stage = stage;
    }

}
