export enum EPGPAuthStatus {
    VERIFIED = "verified",
    SIGNED = "signed",
    WAITING_FOR_PEER_ACCEPTED = "waiting-for-peer-accepted",
    CHECK_RESPONDER = "check-responder",
    CHECK_REQUEST = "check-request",
    SIGNED_INITIATOR = "signed-initiator",
    WAITING_FOR_SIGNED = "waiting-for-signed",
    UNSIGNED = "unsigned"
}