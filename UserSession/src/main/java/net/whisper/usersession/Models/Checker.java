package net.whisper.usersession.Models;


import lombok.Getter;
import lombok.Setter;
import net.whisper.usersession.Interfaces.IBaseClient;
import net.whisper.usersession.Interfaces.IChecker;

import java.util.List;

@Getter
@Setter
public class Checker implements IChecker {
    private String userId;
    private List<Partner> partners;

    public Checker() {
    }

    public Checker(IBaseClient client, List<Partner> partners) {
        this.userId = client.getUserId();
        this.partners = partners;
    }
}
