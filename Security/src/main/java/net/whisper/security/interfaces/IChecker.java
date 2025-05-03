package net.whisper.security.interfaces;


import net.whisper.security.models.Partner;

import java.util.List;

public interface IChecker {
    String getUserId();
    List<Partner> getPartners();
}
