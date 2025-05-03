package net.whisper.security.enums;

public enum ELoginStage {
    INITIALIZED("initialized"),
    AUTHORIZED("authorized");

    private final String stage;

    ELoginStage(String stage) {
        this.stage = stage;
    }

    public String getStage() {
        return this.stage;
    }

}