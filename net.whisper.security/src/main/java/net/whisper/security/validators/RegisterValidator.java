package net.whisper.security.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import net.whisper.security.adnotations.ValidRegister;
import net.whisper.security.dto.requests.RegisterDTO;
import net.whisper.security.helpers.PGPHelper;
import org.bouncycastle.openpgp.*;
import org.bouncycastle.openpgp.jcajce.JcaPGPPublicKeyRingCollection;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

public class RegisterValidator implements ConstraintValidator<ValidRegister, RegisterDTO> {

    private ConstraintValidatorContext context;
    @Override
    public boolean isValid(RegisterDTO registerDTO, ConstraintValidatorContext context) {
        this.context = context;
        if (registerDTO.getUsername() == null || registerDTO.getUsername().isEmpty()) {
            this.setConstraintViolation(context, "Username is null");
            return false;
        }
        if (registerDTO.getStringKey() != null && !registerDTO.getStringKey().isEmpty()) {
            return this.isKeyStringValid(registerDTO);
        }
        if (registerDTO.getStringFile() != null && !registerDTO.getStringFile().isEmpty()) {
            return this.isFileStringValid(registerDTO);
        }
        this.setConstraintViolation(context, "PGP Key is null");
        return false;
    }

    private boolean isFileStringValid(RegisterDTO registerDTO) {
        String keyString = registerDTO.getStringFile();
        String decodedString = this.decodeFromBase64(keyString);
        return this.runChecking(decodedString);
    }


    private boolean isKeyStringValid(RegisterDTO registerDTO)  {
        String keyString = registerDTO.getStringKey();
        return this.runChecking(keyString);
    }

    private boolean runChecking(String key) {
        try {
            return PGPHelper.checkKey(key);
        } catch (IOException ioException) {
            this.setConstraintViolation(context, ioException.getMessage());
            return false;
        } catch (PGPException pgpException) {
            this.setConstraintViolation(context, pgpException.getMessage());
            return false;
        } catch (NoSuchElementException noSuchElementException) {
            this.setConstraintViolation(context, noSuchElementException.getMessage());
            return false;
        }
    }

    private String decodeFromBase64(String key) {
        byte[] fileBytes = Base64.getDecoder().decode(key);
        String fileString = new String(fileBytes, StandardCharsets.UTF_8);
        return fileString;
    }

    private String prepareKey(String keyString) {
        keyString = keyString.replaceAll("-+\\s*[a-zA-Z ]+\\s*-+", "");
        keyString = keyString.replaceAll("\\\\r\\\\n", "\n");
        keyString = keyString.replaceAll("\\\\n", "\n");
        keyString = keyString.replaceAll("\\\\r", "\n");
        keyString = keyString.replaceAll("\\r\\n", "\n");
        keyString = keyString.replaceAll("\\r", "\n");
        keyString = keyString.replaceAll("\\\\t", "\t");
        keyString = keyString.lines()
                .map(String::stripTrailing)
                .collect(Collectors.joining("\n"));
        keyString = keyString.trim();

        return keyString;
    }

    private void setConstraintViolation(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }
}
