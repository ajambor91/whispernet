package net.whisper.security.repositories;

import net.whisper.security.models.RedisUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class RedisRepository {

    @Value("${login.expiration}")
    private Long expitationInMs;

    @Autowired
    private RedisTemplate<String, RedisUser> redisTemplate;

    public void saveUser(String username, RedisUser session) {
        this.saveUser(username, session, this.expitationInMs);
    }

    public void saveUser(String username, RedisUser session, Long expitationInMs) {
        redisTemplate.opsForValue().set(username, session, expitationInMs, TimeUnit.MILLISECONDS);
    }

    public RedisUser getUser(String username) {
        return redisTemplate.opsForValue().get(username);
    }

    public void deleteUser(String sessionToken) {
        redisTemplate.delete(sessionToken);
    }
}
