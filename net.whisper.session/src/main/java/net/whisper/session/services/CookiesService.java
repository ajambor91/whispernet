package net.whisper.session;
import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Service;

@Service
public class CookiesService {
    public Cookie getCookie(TokenWithSessionTemplate tokenBody) {
        Cookie httpOnlyCookie = new Cookie("sessionToken", tokenBody.getWSessionToken());
        httpOnlyCookie.setHttpOnly(true);
        httpOnlyCookie.setSecure(true);
        httpOnlyCookie.setPath("/");
        httpOnlyCookie.setMaxAge(86400);
        return httpOnlyCookie;
    }
}