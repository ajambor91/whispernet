package net.whisper.usersession.Services;

import jakarta.servlet.http.Cookie;
import net.whisper.usersession.Models.IncomingClient;
import net.whisper.usersession.Utils.TestFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CookiesServiceTest {
    private final Integer timeToLive = 360;
    private final CookiesService cookiesService;
    private final IncomingClient client;

    @Autowired
    public CookiesServiceTest(CookiesService cookiesService) {
        this.cookiesService = cookiesService;
        this.client = TestFactory.createIncomingClient();
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
