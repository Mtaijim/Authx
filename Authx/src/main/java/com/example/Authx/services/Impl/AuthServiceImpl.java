package com.example.Authx.services.Impl;

import com.example.Authx.dtos.AuthResponse;
import com.example.Authx.dtos.LoginRequest;

import com.example.Authx.dtos.UserDto;
import com.example.Authx.entity.*;
import com.example.Authx.helper.DeviceParser;
import com.example.Authx.helper.RequestHelper;
import com.example.Authx.repositories.*;
import com.example.Authx.security.JwtService;
import com.example.Authx.services.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.UUID;


@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserService userService;
    private  final PasswordEncoder passwordEncoder;
    private final EmailVerificationTokenRepository tokenRepository;
    private final EmailService emailService;
    private final  userRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final Emailvalidator emailvalidator;
    private final JwtService jwtServices;
//    login services
    private final LoginEventServices loginEventServices;
    private final DeviceParser deviceParser;
    private final AuditLogService auditLogService;
    private final PasswordHistoryService passwordHistoryService;
//    risk
    private final RiskScoreRepository riskScoreRepository;
    private final RiskScoringService riskScoringService;
    private final RiskVerificationTokenRepository riskVerificationTokenRepository;


//    register User
    @Override
    @Transactional
    public UserDto registerUser(UserDto userDto) {

//        validate email first
        emailvalidator.Validate(userDto.getEmail());

        String encodedPassword = passwordEncoder.encode(userDto.getPassword());
        userDto.setPassword(encodedPassword);
//        assign default role
        userDto.setEnable(false);
        UserDto savedUser =  userService.createUser(userDto);

//        fetch user
        User user =userService.getRawUserById(savedUser.getId().toString());
        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(Instant.now().plusSeconds(86400)).build();
        tokenRepository.save(verificationToken);
        emailService.sendVerificationEmail(savedUser.getEmail(), token);

//        audit logs
        auditLogService.log(
                null,
                savedUser.getId(),
                savedUser.getEmail(),
                AuditAction.REGISTER,
                "USER",
                savedUser.getId().toString(),
                "New account registered",
                null, null   );
//save initial password to history
   passwordHistoryService.saveToHistory(
          user,encodedPassword
   );

        return savedUser;
    }

//    verify email
    @Override
    public void verifyEmail(String token) {
        EmailVerificationToken emailVerificationToken = tokenRepository.findByToken(token)
                .orElseThrow(()-> new IllegalArgumentException("Invalid verification token") );

         if(emailVerificationToken.isUsed()){
             throw new IllegalArgumentException("token is already used");
         }

         if(emailVerificationToken.getExpiresAt().isBefore(Instant.now())){
             throw new IllegalArgumentException("Token is Expired ");

         }

         User user = emailVerificationToken.getUser();
         user.setEnable(true);
         userRepository.save(user);

         emailVerificationToken.setUsed(true);
         tokenRepository.save(emailVerificationToken);

    }

//    forget Password
    @Override
    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            passwordResetTokenRepository.deleteByUser(user);
            passwordResetTokenRepository.flush();


        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(Instant.now().plusSeconds(900))
                .build();

        passwordResetTokenRepository.save(resetToken);
        emailService.sendPasswordResetEmail(email,token);
    });
    }

//    reset password
    @Override
    public void resetPassword(String token, String newPassword) {


     PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
             .orElseThrow(()-> new IllegalArgumentException("invalid reset token"));


     if(resetToken.isUsed()){
         throw new IllegalArgumentException("TOKEN IS ALREADY IN USED ");
     }
     if(resetToken.getExpiresAt().isBefore(Instant.now())){
         throw new IllegalArgumentException("TOKEN IS EXPIRED ");
     }

     User user = resetToken.getUser();

     if(passwordHistoryService.ispasswordReused(user,newPassword)){
         throw new IllegalArgumentException(
                 "You cannot reuse your last 5 passwords. " +
                         "Please choose a different password."
         );
     }


     String encodedPassword = passwordEncoder.encode(newPassword);
     user.setPassword(encodedPassword);
     user.resetLockout();
     userRepository.save(user);

//     save to history
        passwordHistoryService.saveToHistory(user,encodedPassword);

     resetToken.setUsed(true);
     passwordResetTokenRepository.save(resetToken);
        auditLogService.log(
                null,
                user.getId(),
                user.getEmail(),
                AuditAction.PASSWORD_RESET,
                "AUTH",
                null,
                "Password reset via email link",
                null, null
        );
    }

//

    public AuthResponse verifyRiskOtp(String email ,String otp){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        RiskVerificationToken token = riskVerificationTokenRepository
                .findByUserAndTokenAndUsedFalse(user,otp)
                .orElseThrow(()-> new RuntimeException("invalid or Otp Expired !"));

        if(token.getExpiresAt().isBefore(Instant.now())){
            throw new RuntimeException("Otp Expired");
        }
        token.setUsed(true);
        riskVerificationTokenRepository.save(token);

        String jwtToken = jwtServices.generateAccessToken(user);
        UserDto userDto = userService.getUserById(user.getId().toString());

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .user(userDto)
                .requiresVerification(false)
                .build();
    }

}
