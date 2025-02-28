package net.whisper.security.services;

import net.whisper.security.dto.requests.RegisterDTO;
import net.whisper.security.entities.User;
import net.whisper.security.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;


@Component
public class RegisterService {
    private final UserRepository userRepository;

    @Autowired
    public RegisterService(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }


    public void setUser(RegisterDTO registerDTO) throws IOException, IllegalArgumentException {
        if (registerDTO == null) {
            throw new IllegalArgumentException("RegisterDTO cannot be null");
        }
        String key;
        if (registerDTO.getStringKey() != null && !registerDTO.getStringKey().isEmpty()) {
            key = registerDTO.getStringKey();
        } else if (registerDTO.getStringFile() != null && !registerDTO.getStringFile().isEmpty()) {
            byte[] keyFileBytes = Base64.getDecoder().decode(registerDTO.getStringFile());
            key = new String(keyFileBytes, StandardCharsets.UTF_8);
        } else {
            throw new IllegalArgumentException("stringKey cannot be empty");
        }
        this.saveUser(registerDTO.getUsername(), key);

    }

    private void saveUser(String username, String key) {
        User user = new User();
        user.setUsername(username);
        user.setActive(false);
        user.setPGPKey(key);
        this.userRepository.save(user);
    }


}
