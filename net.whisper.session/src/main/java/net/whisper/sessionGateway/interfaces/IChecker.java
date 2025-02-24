package net.whisper.sessionGateway.interfaces;

import net.whisper.sessionGateway.models.Partner;

import java.util.List;

public interface IChecker {
    String getUserId();

    List<Partner> getPartners();
}
