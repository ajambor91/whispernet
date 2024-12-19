package net.whisper.wssession.session.repositories;

import net.whisper.wssession.session.models.PeerSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SessionRepository {

    @Autowired
    private RedisTemplate<String, PeerSession> redisTemplate;

    public void saveSession(String sessionToken, PeerSession session) {
        redisTemplate.opsForValue().set(sessionToken, session);
    }

    public PeerSession getSession(String sessionToken) {
        return redisTemplate.opsForValue().get(sessionToken);
    }

    public void deleteSession(String sessionToken) {
        redisTemplate.delete(sessionToken);
    }
}
