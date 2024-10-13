package net.whisper.session;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class SessionRepository {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    public void saveToken(String token) {

        redisTemplate.opsForValue().set( token, "active");
    }

    public String getToken(String token) {
        return redisTemplate.opsForValue().get(token);
    }

    public void deleteToken(String token) {
        redisTemplate.delete(token);
    }
}


