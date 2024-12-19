package net.whisper.sessionGateway.services;

import jakarta.servlet.http.Cookie;
import net.whisper.sessionGateway.models.Client;
import org.springframework.stereotype.Service;

@Service
public class CookiesService {
    public Cookie getCookie(Client tokenBody, Integer timeToLive) {
        Cookie httpOnlyCookie = new Cookie("userToken", tokenBody.getUserToken());
        httpOnlyCookie.setHttpOnly(true);
        httpOnlyCookie.setSecure(true);
        httpOnlyCookie.setPath("/");
        httpOnlyCookie.setMaxAge(timeToLive);
        return httpOnlyCookie;
    }
}