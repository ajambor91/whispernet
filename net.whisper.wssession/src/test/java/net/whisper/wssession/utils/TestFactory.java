package net.whisper.wssession.utils;

import net.whisper.wssession.clients.enums.EClientConnectionStatus;
import net.whisper.wssession.clients.enums.EPeerRole;
import net.whisper.wssession.clients.models.Client;
import net.whisper.wssession.clients.models.ClientWithoutSession;
import net.whisper.wssession.session.enums.ESessionStatus;
import net.whisper.wssession.session.models.PeerClient;
import net.whisper.wssession.session.models.PeerSession;

import java.util.ArrayList;
import java.util.List;

public class TestFactory {

    public static final String USER_ID_INITIATOR = "a01163cd-4c88-44dd-80a0-f09ba02c85cb";
    public static final String USER_TOKEN_INITIATOR = "13e2a422-6f6c-4b8a-afbf-6ffb40f046ae";

    public static final String USER_ID_JOINER = "22469c67-ba59-4bbd-b47a-7d5a4394928a";
    public static final String USER_TOKEN_JOINER = "bb6e4276-7f6c-40fe-a413-e98d912c3510";

    public static final String SESSION_TOKEN_JOINER = "9489dc7f-e441-4a19-86d6-1e7ddb2ea48c";


    public static ClientWithoutSession createClientWihtoutSession() {
        ClientWithoutSession clientWithoutSession = new ClientWithoutSession();
        clientWithoutSession.setUserId(USER_ID_INITIATOR);
        clientWithoutSession.setUserToken(USER_TOKEN_INITIATOR);
        clientWithoutSession.setPeerRole(EPeerRole.INITIATOR);
        clientWithoutSession.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        return clientWithoutSession;
    }

    public static Client createClient() {
        Client client = new Client();
        client.setUserId(USER_ID_JOINER);
        client.setUserToken(USER_TOKEN_JOINER);
        client.setPeerRole(EPeerRole.JOINER);
        client.setSessionToken(SESSION_TOKEN_JOINER);
        client.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        return client;
    }

    public static PeerClient createPeerClientInitiator() {
        PeerClient peerClient = new PeerClient();
        peerClient.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        peerClient.setPeerRole(EPeerRole.INITIATOR);
        peerClient.setUserId(USER_ID_INITIATOR);
        peerClient.setUserToken(USER_TOKEN_INITIATOR);
        return peerClient;
    }

    public static PeerClient createPeerClientJoiner() {
        PeerClient peerClient = new PeerClient();
        peerClient.setUserToken(USER_TOKEN_JOINER);
        peerClient.setUserId(USER_ID_JOINER);
        peerClient.setPeerRole(EPeerRole.JOINER);
        peerClient.setClientConnectionStatus(EClientConnectionStatus.CREATED);
        return peerClient;
    }

    public static PeerSession createPeerSession() {
        PeerSession peerSession = new PeerSession();
        peerSession.setSessionStatus(ESessionStatus.CREATED);
        peerSession.setSessionToken(SESSION_TOKEN_JOINER);
        peerSession.setSecretKey("SECRET");
        List<PeerClient> peers = new ArrayList<>();
        peers.add(TestFactory.createPeerClientInitiator());
        peerSession.setPeerClients(peers);
        return peerSession;
    }

    public static PeerSession createEmptyPeerSession() {
        PeerSession peerSession = new PeerSession();
        peerSession.setSessionStatus(ESessionStatus.CREATED);
        peerSession.setSessionToken(SESSION_TOKEN_JOINER);
        peerSession.setSecretKey("SECRET");
        return peerSession;
    }
}
