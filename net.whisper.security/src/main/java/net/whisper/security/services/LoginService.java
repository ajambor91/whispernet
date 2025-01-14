package net.whisper.security.services;

import net.whisper.security.dto.requests.LoginDTO;
import net.whisper.security.dto.requests.LoginMessageDTO;
import net.whisper.security.dto.responses.LoginResponseDTO;
import net.whisper.security.entities.User;
import net.whisper.security.enums.ELoginStage;
import net.whisper.security.interfaces.ISignedClient;
import net.whisper.security.models.RedisUser;
import net.whisper.security.repositories.RedisRepository;
import net.whisper.security.repositories.UserRepository;
import org.bouncycastle.openpgp.PGPException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
public class LoginService {

    private Logger logger;
    private final UserRepository userRepository;
    private final RedisRepository redisRepository;
    private final PGPVerifierService pgpVerifierService;
    private final JWTService jwtService;
    private final KafkaService kafkaService;
    @Autowired
    public LoginService(
            UserRepository userRepository,
            RedisRepository redisRepository,
            PGPVerifierService pgpVerifierService,
            JWTService jwtService,
            @Lazy KafkaService kafkaService
    ) {
        this.userRepository = userRepository;
        this.redisRepository = redisRepository;
        this.pgpVerifierService = pgpVerifierService;
        this.jwtService = jwtService;
        this.logger = LoggerFactory.getLogger(LoginService.class);
        this.kafkaService = kafkaService;
    }
    public LoginResponseDTO inituializeLoginUser(LoginDTO loginDTO) throws IllegalArgumentException  {
        if (loginDTO.getUsername() == null || loginDTO.getUsername().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null!");
        }
        User user = this.userRepository.findByUsername(loginDTO.getUsername());

        if (user == null) {
            throw new NoSuchElementException("User not found");
        }
        String uuid = UUID.randomUUID().toString();
        RedisUser redisUser = new RedisUser(user.getUsername(),user.getPGPKey(), ELoginStage.INITIALIZED);
        this.redisRepository.saveUser(redisUser.getUsername(), redisUser, 600000L);
        return new LoginResponseDTO(user.getUsername(), uuid);
    }

    public LoginResponseDTO loginUser(LoginMessageDTO loginMessageDTO) throws
            IllegalArgumentException,
            NoSuchElementException,
            PGPException,
            IOException
    {
        RedisUser user = this.redisRepository.getUser(loginMessageDTO.getUsername());
        if (user == null) {
            logger.error("User not found, username={}", loginMessageDTO.getUsername());
            throw new NoSuchElementException("User not found");
        }
        boolean isComfirmed = false;
        if (loginMessageDTO.getSignedMessageFile() != null && !loginMessageDTO.getSignedMessageFile().isEmpty()) {
            byte[] signedMessage = Base64.getDecoder().decode(loginMessageDTO.getSignedMessageFile());
            isComfirmed = this.pgpVerifierService.validSignatureByFile(signedMessage, loginMessageDTO.getMessage(), user);
        } else if (loginMessageDTO.getSignedMessage() != null && !loginMessageDTO.getSignedMessage().isEmpty()) {
            isComfirmed = this.pgpVerifierService.validSignatureByMessage(loginMessageDTO.getSignedMessage(), loginMessageDTO.getMessage(), user);

        }

        logger.info("Decode b64Message, username={}", loginMessageDTO.getUsername());

        logger.info("Get user from Redis, username={}", user.getUsername());

        if (!isComfirmed) {
            logger.error("Cannot verify signature, username={}, message={}", loginMessageDTO.getUsername(), loginMessageDTO.getMessage());
            throw new IllegalArgumentException("Cannot verify signature");
        }
        logger.info("Verified signature, username={}", user.getUsername());
        String jwt = this.jwtService.generateToken(user.getUsername());
        logger.info("Genereated JWT, username={}", user.getUsername());
        user.setJwt(jwt);
        user.setStage(ELoginStage.AUTHORIZED);
        this.redisRepository.saveUser(user.getUsername(), user);
        logger.info("Set logged user in Redis, username={}", user.getUsername());
        return new LoginResponseDTO(user.getUsername(), jwt);
    }

    public void checkLogin(ISignedClient client) {
        Map<String, String> map = new HashMap<>();
        map.put("username", client.getUsername());
        map.put("authorization", client.getJwt());
        try {
            this.checkLogin(map);
            client.setConfirmed(true);

        } catch (Exception e) {
            client.setConfirmed(false);

        } finally {
            this.kafkaService.returnVerifiedClient(client);
        }

    }

    public void checkLogin(Map<String, String> headers) {
        if (headers.get("username") == null || headers.get("username").isEmpty()) {
            throw new NoSuchElementException("Username is null");
        }
        String username = headers.get("username");

        if (headers.get("authorization") == null || headers.get("authorization").isEmpty()) {
            throw new NoSuchElementException("Authorization is null");
        }

        String authorization = headers.get("authorization");
        String token = authorization.replace("Bearer", "").trim();
        RedisUser user = this.redisRepository.getUser(username);
        if (user == null) {

            throw new NoSuchElementException("User not found");
        }
        String jwtTrimmed = user.getJwt().replace("Bearer ", "").trim();
        if (!jwtTrimmed.equals(token) ) {
            throw new IllegalArgumentException("Tokens are not match");
        }
        if (this.jwtService.isTokenValid(token)) {
            return;
        }
        throw new IllegalArgumentException("Invalid token");
    }
}
