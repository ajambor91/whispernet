package net.whisper.security.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Date;
import java.util.NoSuchElementException;

@Component
public class JWTService {
    private final String secretKeyCfg;
    private final Long expitationTimeCfg;
    private final SecretKey secretKey;
    private final Logger logger;

    public JWTService(
            @Value("${login.jwt.secret}") String secretKeyCfg,
            @Value("${login.expiration}") Long expitationTimeCfg) {
        this.logger = LoggerFactory.getLogger(JWTService.class);

        if (secretKeyCfg == null || secretKeyCfg.isEmpty()) {
            logger.error("Secret key not found in config");
            throw new NoSuchElementException("Secret key not found in config");
        }
        this.secretKeyCfg = secretKeyCfg;
        this.expitationTimeCfg = expitationTimeCfg;
        this.secretKey = new SecretKeySpec(secretKeyCfg.getBytes(), SignatureAlgorithm.HS256.getJcaName());
    }

    public String generateToken(String username) {
        return this.generateToken(username, this.expitationTimeCfg);
    }

    public String generateToken(String username, Long customTime) {
        logger.info("Generating JWT for {}, with expiration {}", username, customTime);
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + customTime))
                .signWith(this.secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(this.secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            logger.warn("Token {} is invalid", token);
            return false;
        }
    }

    public String extractToken(String token) {
        logger.info("Extracting token {}", token);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(this.secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        if (claims == null) {
            logger.warn("Extracted token {} and token data is null", token);
            return null;
        }
        logger.info("Extracted token {}", token);
        return claims.getSubject();
    }

}
