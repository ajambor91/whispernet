package net.whisper.security.adnotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import net.whisper.security.validators.RegisterValidator;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = RegisterValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRegister {

    String message() default "Invalid public key format";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
