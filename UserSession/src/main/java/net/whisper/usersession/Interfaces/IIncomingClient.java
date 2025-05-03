package net.whisper.usersession.Interfaces;

import net.whisper.usersession.Models.Partner;

import java.util.List;

public interface IIncomingClient extends IClient {
    String getSecretKey();

    List<Partner> getPartners();

    void setPartners(List<Partner> initiatorName);
}
