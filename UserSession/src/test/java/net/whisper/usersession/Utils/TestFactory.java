package net.whisper.usersession.Utils;

import jakarta.servlet.http.Cookie;
import net.whisper.usersession.DTO.Requests.PeerState;
import net.whisper.usersession.Enums.EClientConnectionStatus;
import net.whisper.usersession.Enums.EPGPSessionType;
import net.whisper.usersession.Enums.EPeerRole;
import net.whisper.usersession.Interfaces.IChecker;
import net.whisper.usersession.Models.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class TestFactory {
    public static final String TEST_SESSION_TOKEN = "7c944fc9-ad51-4392-bde2-f4b6126ea62e";
    public static final String TEST_USER_TOKEN = "d14077c2-b9ee-4cca-acac-3e4fba130f51";
    public static final String TEST_USER_ID = "8c08d064-abbc-4e7a-8818-1365a1fb27de";

    public static final String TEST_SESSION_TOKEN_JOINER = "8c08d064-abbc-4e7a-8818-1365a1fb27de";
    public static final String TEST_USER_TOKEN_JOINER = "7c944fc9-ad51-4392-bde2-f4b6126ea62e";
    public static final String TEST_USER_ID_JOINER = "d14077c2-b9ee-4cca-acac-3e4fba130f51";

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
        client.setSessionType(EPGPSessionType.UNSIGNED);
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
        client.setSessionType(EPGPSessionType.UNSIGNED);
        client.setSessionToken(TEST_SESSION_TOKEN_JOINER);
        client.setPeerRole(EPeerRole.JOINER);
        client.setUserToken(TEST_USER_TOKEN_JOINER);
        List<Partner> testList = new ArrayList<>();
        testList.add(TestFactory.createTestPartner());
        client.setPartners(testList);
        return client;
    }

    public static Partner createTestPartner() {
        Partner partner = new Partner();
        partner.setUsername("Janek");
        partner.setPublicKey("KEY");
        return partner;
    }

    public static Cookie createCookie(IncomingClient tokenBody) {
        Cookie httpOnlyCookie = new Cookie("userToken", tokenBody.getUserToken());
        httpOnlyCookie.setHttpOnly(true);
        httpOnlyCookie.setSecure(true);
        httpOnlyCookie.setPath("/");
        httpOnlyCookie.setMaxAge(86400);
        return httpOnlyCookie;
    }

    public static PeerState createPeerState() {
        PeerState peerState = new PeerState();
        peerState.setPeerRole(EPeerRole.INITIATOR.getPeerRoleName());
        peerState.setSecretKey("SECRET");
        peerState.setSessionToken(TEST_SESSION_TOKEN);
        peerState.setSigned(false);
        peerState.setSessionAuthType(EPGPSessionType.CHECK_RESPONDER.getSessionPGPStatus());
        return peerState;
    }

    public static PeerState createJoinPeerState() {
        PeerState peerState = new PeerState();
        peerState.setPeerRole(EPeerRole.JOINER.getPeerRoleName());
        peerState.setSecretKey("SECRET");
        peerState.setSessionToken(TEST_SESSION_TOKEN_JOINER);
        peerState.setSigned(false);
        peerState.setSessionAuthType(EPGPSessionType.CHECK_RESPONDER.getSessionPGPStatus());
        return peerState;
    }

    public static Map<String, String> createTestJoinHeaders() {
        Map<String, String> map = Map.of("username", "Joiner", "authorization", "AuthKey");
        return map;
    }

    public static SignedClient createJoinSignedInitiator() {
        SignedClient signedClient = new SignedClient();
        signedClient.setJwt("SECRET");
        signedClient.setUsername("Initiator");
        signedClient.setUserId(TEST_USER_ID);
        signedClient.setUserToken(TEST_USER_TOKEN);
        return signedClient;
    }

    public static SignedClient createJoinSignedClient() {
        SignedClient signedClient = new SignedClient();
        signedClient.setJwt("SECRET");
        signedClient.setUsername("Joiner");
        signedClient.setUserId(TEST_USER_ID_JOINER);
        signedClient.setUserToken(TEST_USER_TOKEN_JOINER);
        return signedClient;
    }

    public static Map<String, String> createTestInitiatorHeaders() {
        Map<String, String> map = Map.of("username", "Joiner", "authorization", "AuthKey");
        return map;
    }

    public static IChecker createUpdateChecker() {
        List<Partner> partners = new ArrayList<>();
        partners.add(TestFactory.createTestPartner());
        IChecker checker = new Checker(TestFactory.createJoinerClient(), partners);
        return checker;
    }


    private static Partner createPartner() {
        Partner partner = new Partner();
        partner.setUsername("Initiatior");
        partner.setPublicKey("A0FF");
        return partner;
    }
}
