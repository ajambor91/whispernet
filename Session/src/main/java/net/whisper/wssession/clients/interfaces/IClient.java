package net.whisper.wssession.clients.interfaces;

import net.whisper.wssession.clients.models.Partner;
import net.whisper.wssession.core.interfaces.IBaseClient;

import java.util.List;

public interface IClient extends IBaseClient {
    String getSessionToken();

    List<Partner> getPartners();

    void setPartners(List<Partner> partners);
}
