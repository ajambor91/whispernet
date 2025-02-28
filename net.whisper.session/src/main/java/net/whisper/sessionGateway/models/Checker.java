package net.whisper.sessionGateway.models;


import lombok.Getter;
import lombok.Setter;
import net.whisper.sessionGateway.interfaces.IBaseClient;
import net.whisper.sessionGateway.interfaces.IChecker;

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
