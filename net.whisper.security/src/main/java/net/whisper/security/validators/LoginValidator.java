package net.whisper.security.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import net.whisper.security.adnotations.ValidLogin;
import net.whisper.security.dto.requests.LoginMessageDTO;

public class LoginValidator   implements ConstraintValidator<ValidLogin, LoginMessageDTO> {
    private ConstraintValidatorContext context;

    @Override
    public boolean isValid(LoginMessageDTO loginMessageDTO, ConstraintValidatorContext context) {
        this.context = context;
        if (loginMessageDTO.getUsername() == null || loginMessageDTO.getUsername().isEmpty()) {
            this.setConstraintViolation(context, "Username is null");
            return false;
        }

        if (loginMessageDTO.getMessage() == null || loginMessageDTO.getMessage().isEmpty()) {
            this.setConstraintViolation(context, "Message is null");
            return false;
        }
        boolean isSignedMsg = false;
        if (loginMessageDTO.getSignedMessage() != null && !loginMessageDTO.getSignedMessage().isEmpty()) {
            String[] parts = loginMessageDTO.getSignedMessage().split("-----BEGIN PGP SIGNATURE-----");
            if (parts.length != 2) {
                isSignedMsg = false;
            }
            isSignedMsg = true;
        }

        if (!isSignedMsg && loginMessageDTO.getSignedMessageFile() != null && !loginMessageDTO.getSignedMessageFile().isEmpty()) {
            isSignedMsg = true;
        }

        if (!isSignedMsg) {
            this.setConstraintViolation(context, "Both signature is null");
        }

        return isSignedMsg;

    }

    private void setConstraintViolation(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message)
                .addConstraintViolation();
    }
}
