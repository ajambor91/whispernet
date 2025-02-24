import {EPGPAuthStatus} from "./pgp-auth-status.enum";

export class PgpAuthEnumMapper {
    public static mapValue(value: string): EPGPAuthStatus {
        switch (value) {
            case EPGPAuthStatus.UNSIGNED:
                return EPGPAuthStatus.UNSIGNED;
            case EPGPAuthStatus.SIGNED:
                return EPGPAuthStatus.SIGNED;
            case EPGPAuthStatus.VERIFIED:
                return EPGPAuthStatus.VERIFIED;
            case EPGPAuthStatus.CHECK_REQUEST:
                return EPGPAuthStatus.CHECK_REQUEST;
            case EPGPAuthStatus.CHECK_RESPONDER:
                return EPGPAuthStatus.CHECK_RESPONDER;
            case EPGPAuthStatus.WAITING_FOR_SIGNED:
                return EPGPAuthStatus.WAITING_FOR_SIGNED;
            case EPGPAuthStatus.WAITING_FOR_PEER_ACCEPTED:
                return EPGPAuthStatus.WAITING_FOR_PEER_ACCEPTED;
            case EPGPAuthStatus.SIGNED_INITIATOR:
                return EPGPAuthStatus.SIGNED_INITIATOR;
        }
    }
}