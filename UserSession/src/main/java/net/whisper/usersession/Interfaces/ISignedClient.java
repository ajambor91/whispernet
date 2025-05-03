package net.whisper.usersession.Interfaces;

public interface ISignedClient extends IBasicClient {
    String getUsername();

    void setUsername(String username);

    String getJwt();

    void setJwt(String jwt);


}
