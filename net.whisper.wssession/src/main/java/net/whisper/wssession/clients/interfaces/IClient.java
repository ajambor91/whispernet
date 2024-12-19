package net.whisper.wssession.clients.interfaces;

import net.whisper.wssession.core.interfaces.IBaseClient;

public interface IClient extends IBaseClient {
    String getSessionToken();
}
