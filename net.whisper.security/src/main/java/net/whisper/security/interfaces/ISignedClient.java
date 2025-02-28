package net.whisper.security.interfaces;

public interface ISignedClient extends IBaseClient {
    String getUsername();

    void setUsername(String username);

    String getJwt();

    void setJwt(String jwt);

    String getPublicKey();

    void setPublicKey(String publicKey);
}
