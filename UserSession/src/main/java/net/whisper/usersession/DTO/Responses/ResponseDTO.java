package net.whisper.usersession.DTO.Responses;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.whisper.usersession.Interfaces.IBaseClient;
import net.whisper.usersession.Models.IncomingClient;
import net.whisper.usersession.Models.Partner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ResponseDTO {
    private String userToken;
    private String userId;
    private String sessionToken;
    private String peerRole;
    private String secretKey;
    private String sessionAuthType;
    private List<PartnerDTO> partnersDTO;

    public ResponseDTO() {
    }

    public ResponseDTO(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public ResponseDTO(IBaseClient client, String sessionToken) {
        this.sessionToken = sessionToken;

        this.peerRole = client.getPeerRole().getPeerRoleName();
        this.sessionAuthType = client.getSessionType().getSessionPGPStatus();
        this.userId = client.getUserId();
        this.userToken = client.getUserToken();
        this.partnersDTO = this.setPartners(null);
    }

    public ResponseDTO(IncomingClient client) {
        this(client, client.getSessionToken());
        this.secretKey = client.getSecretKey();
        this.partnersDTO = this.setPartners(client.getPartners());
    }

    private List<PartnerDTO> setPartners(List<Partner> partners) {
        if (partners == null || partners.isEmpty()) {
            return new ArrayList<>();
        }
        return partners.stream().map(PartnerDTO::new).toList();
    }

    public Map<String, Object> toMap() {
        Map<String, Object> map = new HashMap<String, Object>();
        if (this.sessionToken != null) {
            map.put("sessionToken", this.sessionToken);
        }
        if (this.peerRole != null) {
            map.put("peerRole", this.peerRole);
        }
        if (this.sessionAuthType != null) {
            map.put("sessionAuthType", this.sessionAuthType);
        }
        if (this.secretKey != null) {
            map.put("secretKey", this.secretKey);
        }
        if (this.userToken != null) {
            map.put("userToken", this.userToken);
        }

        if (this.partnersDTO != null && !partnersDTO.isEmpty()) {
            Object[] partnersMap = this.partnersDTO.stream().map(partner -> Map.of(
                    "publicKey", partner.publicKey,
                    "username", partner.username
            )).toArray();
            map.put("partners", partnersMap);
        }
        return map;
    }

    @Override
    public String toString() {
        try {
            return new ObjectMapper().writeValueAsString(this);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    private class PartnerDTO {
        private final String publicKey;
        private final String username;

        private PartnerDTO(Partner partner) {
            this.publicKey = partner.getPublicKey();
            this.username = partner.getUsername();
        }
    }
}
