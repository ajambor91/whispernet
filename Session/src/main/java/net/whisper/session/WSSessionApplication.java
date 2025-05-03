package net.whisper.session;

import net.whisper.session.Session.Models.PeerSession;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@SpringBootApplication
public class WSSessionApplication {

    public static void main(String[] args) {
        SpringApplication.run(WSSessionApplication.class, args);
    }

    @Bean
    public RedisTemplate<String, PeerSession> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, PeerSession> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        return template;
    }

}
