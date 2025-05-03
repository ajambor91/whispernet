package net.whisper.session.Clients.Interfaces;


import net.whisper.session.Clients.Models.Partner;
import net.whisper.session.Core.Interfaces.IBaseClient;

import java.util.List;

public interface IClient extends IBaseClient {
    String getSessionToken();

    List<Partner> getPartners();

    void setPartners(List<Partner> partners);
}
