package com.example.Authx.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {


    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${BREVO_API_KEY}")
    private String brevoApiKey;


    private final RestClient restClient = RestClient.create();

    private void sendViaApi(String toEmail, String subject, String htmlContent){
        try {
            Map<String,Object> payload = Map.of(
                    "Sender", Map.of("name","Authx","email",fromEmail),
                    "to", List.of(Map.of("email",toEmail)),
                    "subject",subject,
                    "htmlContent",htmlContent
            );
            restClient.post()
                    .uri("https://api.brevo.com/v3/smtp/email")
                    .header("api-key", brevoApiKey)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
        }
        }

    public void sendVerificationEmail(String toEmail, String token) {
        String verifyLink = frontendUrl + "/verify-email?token=" + token;
        String html = """
                <p>Hi,</p>
                <p>Thanks for registering. Click the link below to verify your email:</p>
                <p><a href="%s">%s</a></p>
                <p>This link expires in 24 hours.</p>
                <p>If you didn't register, ignore this email.</p>
                """.formatted(verifyLink, verifyLink);

        sendViaApi(toEmail, "VERIFY YOUR AUTHX ACCOUNT", html);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String html = """
                <p>Hi,</p>
                <p>You requested a password reset. Click the link below:</p>
                <p><a href="%s">%s</a></p>
                <p>This link expires in 15 minutes.</p>
                <p>If you didn't request this, ignore this email — your password won't change.</p>
                """.formatted(resetLink, resetLink);

        sendViaApi(toEmail, "RESET YOUR AUTHX PASSWORD", html);
    }

    public void sendSuspiciousLoginAlert(
            String toEmail,
            String name,
            String device,
            String os,
            String ipAddress,
            LocalDateTime loginTime
    ) {
        String formattedTime = loginTime.format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"));

        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #1a1a2e;">New Login Detected</h2>
                  <p>Hi <strong>%s</strong>,</p>
                  <p>We noticed a new login to your <strong>AuthX</strong> account.</p>
                  <div style="background: #f8f9fa; border-left: 4px solid #e74c3c; padding: 16px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 4px 0;"><strong>Device:</strong> %s / %s</p>
                    <p style="margin: 4px 0;"><strong>IP Address:</strong> %s</p>
                    <p style="margin: 4px 0;"><strong>Time:</strong> %s</p>
                  </div>
                  <p>If this was you, no action needed.</p>
                  <p>If this wasn't you, secure your account immediately:</p>
                  <a href="%s/forgot-password" style="display: inline-block; background: #e74c3c; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 10px 0;">Secure My Account</a>
                  <p style="color: #888; font-size: 12px; margin-top: 30px;">This email was sent by AuthX Security. Please do not reply.</p>
                </div>
                """.formatted(
                name != null ? name : "User",
                device, os, ipAddress, formattedTime, frontendUrl
        );

        sendViaApi(toEmail, "⚠️ New login detected on your AuthX account", html);
        log.info("Suspicious login alert sent to: {}", toEmail);
    }

    public void sendRiskAlertEmail(String toEmail, String otp) {
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #1a1a2e;">Verify Your Login</h2>
                  <p>Hi,</p>
                  <p>We detected a login attempt on your <strong>AuthX</strong> account that looks unusual.</p>
                  <p>To continue, please enter the code below:</p>
                  <div style="background: #f8f9fa; border-left: 4px solid #e67e22; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: center;">
                    <p style="margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e;">%s</p>
                  </div>
                  <p style="color: #555;">This code expires in <strong>5 minutes</strong>.</p>
                  <p>If this wasn't you, do not share this code with anyone and consider resetting your password immediately.</p>
                  <a href="%s/forgot-password" style="display: inline-block; background: #e67e22; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 10px 0;">Secure My Account</a>
                  <p style="color: #888; font-size: 12px; margin-top: 30px;">This email was sent by AuthX Security. Please do not reply.</p>
                </div>
                """.formatted(otp, frontendUrl);

        sendViaApi(toEmail, "Verify your Login - Authx Security", html);
    }

    public void sendAccountLockedEmail(String toEmail, String name, int lockoutMinutes) {
        String html = """
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h2 style="color: #e74c3c;">Account Temporarily Locked</h2>
                  <p>Hi <strong>%s</strong>,</p>
                  <p>Your <strong>AuthX</strong> account has been temporarily locked due to too many failed login attempts.</p>
                  <div style="background: #fff3f3; border-left: 4px solid #e74c3c; padding: 16px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 4px 0; color: #c0392b;"><strong>Locked for:</strong> %d minutes</p>
                    <p style="margin: 4px 0; color: #555;">Your account will automatically unlock after %d minutes.</p>
                  </div>
                  <p>If this wasn't you, reset your password immediately:</p>
                  <a href="%s/forgot-password" style="display: inline-block; background: #e74c3c; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
                  <p style="color: #888; font-size: 12px; margin-top: 30px;">AuthX Security Team</p>
                </div>
                """.formatted(name != null ? name : "User", lockoutMinutes, lockoutMinutes, frontendUrl);

        sendViaApi(toEmail, "🔒 Your AuthX account has been locked", html);
    }
    }

