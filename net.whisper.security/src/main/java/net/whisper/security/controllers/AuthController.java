package net.whisper.security.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import net.whisper.security.dto.requests.LoginDTO;
import net.whisper.security.dto.requests.LoginMessageDTO;
import net.whisper.security.dto.requests.RegisterDTO;
import net.whisper.security.dto.responses.ErrorResponseDTO;
import net.whisper.security.dto.responses.GenericSuccessDTO;
import net.whisper.security.dto.responses.LoginResponseDTO;
import net.whisper.security.services.LoginService;
import net.whisper.security.services.RegisterService;
import org.bouncycastle.openpgp.PGPException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/")
public class AuthController {

    private final Logger logger;
    private final RegisterService registerService;
    private final LoginService loginService;

    @Autowired
    public AuthController(RegisterService registerService, LoginService loginService) {
        this.logger = LoggerFactory.getLogger(AuthController.class);
        this.registerService = registerService;
        this.loginService = loginService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterDTO registerDTO) {
        logger.info("AuthController:register, Received register data, username={}", registerDTO.getUsername());
        try {
             this.registerService.setUser(registerDTO);
                GenericSuccessDTO genericSuccessDTO = new GenericSuccessDTO();
                genericSuccessDTO.setMessage("Register success");
                return ResponseEntity.ok(genericSuccessDTO);
        } catch (IOException e) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
            errorResponseDTO.setMessage(e.getMessage());
            this.logger.error("AuthController:register, IOException username={}, message={}", registerDTO.getUsername(), e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponseDTO);
        } catch (IllegalArgumentException e) {
            ErrorResponseDTO errorDTO = new ErrorResponseDTO();
            errorDTO.setMessage(e.getMessage());
            this.logger.error("AuthController:register, IllegalArgumentException username={}, message={}", registerDTO.getUsername(), e.getMessage());
            return ResponseEntity.badRequest().body(errorDTO);
        }
    }

    @PostMapping("/initialize-login")
    public ResponseEntity<?> initializeLogin(@RequestBody @Valid LoginDTO loginDTO) {
        logger.info("AuthController:initializeLogin, Received initialize login request, username={}", loginDTO.getUsername());
        try {
            LoginResponseDTO loginResponseDTO = this.loginService.inituializeLoginUser(loginDTO);
            return ResponseEntity.ok(loginResponseDTO);
        } catch (IllegalArgumentException e) {
            ErrorResponseDTO errorDTO = new ErrorResponseDTO();
            errorDTO.setMessage("Username is null");
            return ResponseEntity.badRequest().body(errorDTO);
        } catch (NoSuchElementException e) {
            ErrorResponseDTO errorDTO = new ErrorResponseDTO();
            errorDTO.setMessage(String.format("Username %s not found", loginDTO.getUsername()));
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorDTO);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginMessageDTO loginMessage) {
        logger.info("AuthController:login, Received login request, username={}", loginMessage.getUsername());

        try {
            LoginResponseDTO loginResponseDTO = this.loginService.loginUser(loginMessage);
            return ResponseEntity.ok(loginResponseDTO);
        } catch (NoSuchElementException e) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
            errorResponseDTO.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponseDTO);
        } catch (PGPException e) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
            errorResponseDTO.setMessage(e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponseDTO);
        } catch (IOException e) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
            errorResponseDTO.setMessage(e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponseDTO);
        }
    }

    @PostMapping("/check-login")
    public ResponseEntity<?> checkLogin(@RequestHeader Map<String, String> headers) {
        try {
            this.loginService.checkLogin(headers);
            GenericSuccessDTO genericSuccessDTO = new GenericSuccessDTO();
            genericSuccessDTO.setMessage("Authorized");
            return ResponseEntity.ok(genericSuccessDTO);
        } catch (Exception e) {
            ErrorResponseDTO errorResponseDTO = new ErrorResponseDTO();
            errorResponseDTO.setMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponseDTO);
        }

    }
}
