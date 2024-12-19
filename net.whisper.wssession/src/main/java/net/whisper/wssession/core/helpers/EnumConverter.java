package net.whisper.wssession.core.helpers;

import net.whisper.wssession.clients.enums.EPeerRole;

public class EnumConverter {

    public static EPeerRole convertToPeerRole(String roleName) {
        try {
            return EPeerRole.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role name: " + roleName, e);
        }
    }
}
