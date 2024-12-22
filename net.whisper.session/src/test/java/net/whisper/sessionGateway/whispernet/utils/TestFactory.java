package net.whisper.sessionGateway.whispernet.utils;

import jakarta.servlet.http.Cookie;
import net.whisper.sessionGateway.enums.EClientConnectionStatus;
import net.whisper.sessionGateway.enums.EPeerRole;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.models.ClientWithoutSession;
import net.whisper.sessionGateway.models.IncomingClient;
import net.whisper.sessionGateway.templates.KafkaClientMessage;

public class TestFactory {
    public static final String TEST_SESSION_TOKEN = "7c944fc9-ad51-4392-bde2-f4b6126ea62e";
    public static final String TEST_USER_TOKEN = "d14077c2-b9ee-4cca-acac-3e4fba130f51";
    public static final String TEST_USER_ID = "8c08d064-abbc-4e7a-8818-1365a1fb27de";

    public static final String TEST_SESSION_TOKEN_JOINER = "8c08d064-abbc-4e7a-8818-1365a1fb27de";
    public static final String TEST_USER_TOKEN_JOINER = "7c944fc9-ad51-4392-bde2-f4b6126ea62e";
    public static final String TEST_USER_ID_JOINER = "d14077c2-b9ee-4cca-acac-3e4fba130f51";

    public static KafkaClientMessage createKafkaClientMessage() {
        KafkaClientMessage kafkaClientMessage = new KafkaClientMessage();
        kafkaClientMessage.setSessionToken(TEST_SESSION_TOKEN);
        kafkaClientMessage.setUserToken(TEST_USER_TOKEN);
        kafkaClientMessage.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        kafkaClientMessage.setUserId(TEST_USER_ID);
        kafkaClientMessage.setPeerRole(EPeerRole.INITIATOR);
        return kafkaClientMessage;
    }

    public static Client createClient() {
        Client client = new Client();
        client.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        client.setUserId(TEST_USER_ID);
        client.setSessionToken(TEST_SESSION_TOKEN);
        client.setPeerRole(EPeerRole.INITIATOR);
        client.setUserToken(TEST_USER_TOKEN);
        return client;
    }

    public static IncomingClient createIncomingClient() {
        IncomingClient client = new IncomingClient();
        client.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        client.setUserId(TEST_USER_ID);
        client.setSessionToken(TEST_SESSION_TOKEN);
        client.setPeerRole(EPeerRole.INITIATOR);
        client.setUserToken(TEST_USER_TOKEN);
        client.setSecretKey("SECRET");
        return client;
    }


    public static ClientWithoutSession createClientWithoutSession() {
        ClientWithoutSession client = new ClientWithoutSession();
        client.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        client.setUserId(TEST_USER_ID);
        client.setPeerRole(EPeerRole.INITIATOR);
        client.setUserToken(TEST_USER_TOKEN);
        return client;
    }

    public static Client createJoinerClient() {
        Client client = new Client();
        client.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        client.setUserId(TEST_USER_ID_JOINER);
        client.setSessionToken(TEST_SESSION_TOKEN_JOINER);
        client.setPeerRole(EPeerRole.JOINER);
        client.setUserToken(TEST_USER_TOKEN_JOINER);
        return client;
    }

    public static IncomingClient createIncomingJoinerClient() {
        IncomingClient client = new IncomingClient();
        client.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        client.setUserId(TEST_USER_ID_JOINER);
        client.setSecretKey("SECRET");
        client.setSessionToken(TEST_SESSION_TOKEN_JOINER);
        client.setPeerRole(EPeerRole.JOINER);
        client.setUserToken(TEST_USER_TOKEN_JOINER);
        return client;
    }


    public static Cookie createCookie(IncomingClient tokenBody) {
        Cookie httpOnlyCookie = new Cookie("userToken", tokenBody.getUserToken());
        httpOnlyCookie.setHttpOnly(true);
        httpOnlyCookie.setSecure(true);
        httpOnlyCookie.setPath("/");
        httpOnlyCookie.setMaxAge(86400);
        return httpOnlyCookie;
    }
}
