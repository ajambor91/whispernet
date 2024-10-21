package net.whisper.session;
import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Service;
import net.whisper.session.Client;
@Service
public class CookiesService {
    public Cookie getCookie(Client tokenBody) {
        Cookie httpOnlyCookie = new Cookie("sessionToken", tokenBody.getUserToken());
        httpOnlyCookie.setHttpOnly(true);
        httpOnlyCookie.setSecure(true);
        httpOnlyCookie.setPath("/");
        httpOnlyCookie.setMaxAge(86400);
        return httpOnlyCookie;
    }
}