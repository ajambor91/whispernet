package net.whisper.sessionGateway.interfaces;

public interface IPartner {
    String getUsername();

    void setUsername(String username);

    String getPublicKey();

    void setPublicKey(String publicKey);
}
