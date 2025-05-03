package net.whisper.usersession.Exceptions;

import net.whisper.usersession.Interfaces.IBaseClient;

public class UserUnauthorizationException extends RuntimeException {
    private final IBaseClient incomingClient;

    public UserUnauthorizationException(String message, IBaseClient baseClient) {
        super(message);
        this.incomingClient = baseClient;
    }

    public IBaseClient getClient() {
        return this.incomingClient;
    }
}
