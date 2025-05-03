package net.whisper.usersession.Services;

import jakarta.servlet.http.Cookie;
import net.whisper.usersession.Interfaces.IBaseClient;
import org.springframework.stereotype.Service;

@Service
public class CookiesService {
    public Cookie getCookie(IBaseClient tokenBody, Integer timeToLive) {
        Cookie httpOnlyCookie = new Cookie("userToken", tokenBody.getUserToken());
        httpOnlyCookie.setHttpOnly(true);
        httpOnlyCookie.setSecure(true);
        httpOnlyCookie.setPath("/");
        httpOnlyCookie.setMaxAge(timeToLive);
        return httpOnlyCookie;
    }
}