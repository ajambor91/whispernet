package net.whisper.security.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    //TODO change back unique = false
    @Column(length = 32768, nullable = false, unique = false)
    private String PGPKey;

    @Column(nullable = false)
    private boolean isActive;

    @PrePersist
    private void validateAndProcess() {
        if (this.username == null || this.username.isBlank()) {
            throw new IllegalArgumentException("Username cannot be null or blank");
        }
        if (this.PGPKey == null) {
            throw new IllegalArgumentException("Public key cannot be null or blank");
        }
        this.isActive = false;
        this.username = this.username.trim();


    }
}
