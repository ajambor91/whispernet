export enum WsConnectionError {
    WEBRTC_OFFER_NOT_FOUND = 'webrtc-offer-not-found',
    WEBRTC_ANSWER_NOT_FOUND = 'webrtc-answer-not-found',
    ICE_CANDIDATE_NOT_FOUND = 'ice-candidate-not-found',
    UNAUTHORIZED_ACCESS = 'unauthorized-access',
    INVALID_SESSION_TOKEN = 'invalid-session-token',
    CONNECTION_TIMEOUT = 'connection-timeout',
    MESSAGE_FORMAT_ERROR = 'message-format-error',
    RATE_LIMIT_EXCEEDED = 'rate-limit-exceeded',
    SERVER_INTERNAL_ERROR = 'server-internal-error',
    SERVICE_UNAVAILABLE = 'service-unavailable',
    UNSUPPORTED_PROTOCOL = 'unsupported-protocol',
    CONNECTION_CLOSED_BY_SERVER = 'connection-closed-by-server',
    DUPLICATE_SESSION = 'duplicate-session',
    SESSION_EXPIRED = 'session-expired',
    INVALID_PAYLOAD = 'invalid-payload',
    MAX_RETRY_LIMIT_REACHED = 'max-retry-limit-reached'
}
