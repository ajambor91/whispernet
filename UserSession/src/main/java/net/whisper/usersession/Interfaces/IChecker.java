package net.whisper.usersession.Interfaces;

import net.whisper.usersession.Models.Partner;

import java.util.List;

public interface IChecker {
    String getUserId();

    List<Partner> getPartners();
}
