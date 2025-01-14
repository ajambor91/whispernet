package net.whisper.security.models;

import lombok.Getter;
import lombok.Setter;
import net.whisper.security.interfaces.IBaseClient;


@Getter
@Setter
public abstract class BaseClient implements IBaseClient {
    private String userToken;
    private String userId;


    public BaseClient() {

    }
}
