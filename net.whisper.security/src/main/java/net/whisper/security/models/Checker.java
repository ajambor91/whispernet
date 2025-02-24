package net.whisper.security.models;


import lombok.Getter;
import lombok.Setter;
import net.whisper.security.interfaces.IChecker;

import java.util.List;

@Getter
@Setter
public class Checker implements IChecker {
    private String userId;
    private List<Partner> partners;
}
