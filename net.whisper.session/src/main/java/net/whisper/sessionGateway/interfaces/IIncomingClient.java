package net.whisper.sessionGateway.interfaces;

import net.whisper.sessionGateway.models.Partner;

import java.util.List;

public interface IIncomingClient extends IClient {
    String getSecretKey();

    List<Partner> getPartners();

    void setPartners(List<Partner> initiatorName);
}
