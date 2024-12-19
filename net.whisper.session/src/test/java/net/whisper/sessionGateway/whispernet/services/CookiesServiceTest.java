package net.whisper.sessionGateway.whispernet.services;

import jakarta.servlet.http.Cookie;
import net.whisper.sessionGateway.models.Client;
import net.whisper.sessionGateway.services.CookiesService;
import net.whisper.sessionGateway.whispernet.utils.TestFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CookiesServiceTest {
    private final Integer timeToLive = 360;
    private final CookiesService cookiesService;
    private final Client client;

    @Autowired
    public CookiesServiceTest(CookiesService cookiesService) {
        this.cookiesService = cookiesService;
        this.client = TestFactory.createClient();
    }

    @Test
    @DisplayName("Should create httpOnly cookie")
    public void getCookiePass() {
        Cookie cookie = this.cookiesService.getCookie(this.client, this.timeToLive);
        assertNotNull(cookie);
        assertTrue(cookie.getSecure());
        assertTrue(cookie.isHttpOnly());
        assertEquals(cookie.getPath(), "/");
        assertEquals(cookie.getMaxAge(), this.timeToLive);
    }
}
