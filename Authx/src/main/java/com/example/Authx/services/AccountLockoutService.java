package com.example.Authx.services;

import com.example.Authx.entity.User;
import com.example.Authx.repositories.userRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountLockoutService {

    private final EmailService emailService;
private final userRepository userRepository;
private static final int MAX_ATTEMPT = 5;
    private static final int LOCKOUT_MINUTES = 15;


    public void handleFailedAttempt(User user){
        user.incrementFailedAttempts();
        if(user.getFailedAttempts()>=MAX_ATTEMPT) {
            user.lockFor(LOCKOUT_MINUTES);
            userRepository.save(user);
            try {
                emailService.sendAccountLockedEmail(
                        user.getEmail(), user.getName(), LOCKOUT_MINUTES
                );
            } catch (Exception e) {
                log.error("Lockout email failed for {}: {}", user.getEmail(), e.getMessage(), e);
            }
        }
        else {
            userRepository.save(user);
        }
    }
public void handleSuccess(User user){
        if(user.getFailedAttempts()>0 || user.getLockedUntil() != null){
            user.resetLockout();
            userRepository.save(user);
        }
}

public boolean isLocked(User user){
        return user.isAccountLocked();
}

public long minutesUntilUnlock(User user){
        if(user.getLockedUntil() ==null) return 0 ;

        return Duration.between(
                LocalDateTime.now(),user.getLockedUntil()
        ).toMinutes()+1;
}

public int remainingAttempts(User user){
        return Math.max(
                0,MAX_ATTEMPT-user.getFailedAttempts()
        );
}

}

