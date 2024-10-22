package net.whisper.wssession;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@Repository
public class WSSessionRepository {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public void saveToken(String sessionToken, String userToken) {
        redisTemplate.opsForValue().set(sessionToken, userToken);
    }

    public String getToken(String sessionId) {
        return redisTemplate.opsForValue().get(sessionId);
    }

    public void deleteToken(String sessionId) {
        redisTemplate.delete(sessionId);
    }
}
