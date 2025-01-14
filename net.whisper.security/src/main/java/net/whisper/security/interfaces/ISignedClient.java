package net.whisper.security.interfaces;

public interface ISignedClient extends IBaseClient{
    String getUsername();

    void setUsername(String username);

    String getJwt();

    void setJwt(String jwt);

    boolean isConfirmed();

    void setConfirmed(boolean confirmed);
}
