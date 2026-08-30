package com.example.auth_app.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${brevo.api.url}")
    private String brevoApiUrl;

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    public void sendWelcomeEmail(String toEmail, String name) {
        String subject = "Welcome to our Platform";
        String content = "Hello " + name + ",<br><br>Thanks for registering with us!";
        sendEmail(toEmail, subject, content);
    }

    public void SendResetOtpEmail(String toEmail, String otp) {
        String subject = "Password Reset OTP";
        String content = "Your OTP for resetting your password is <b>" + otp + "</b>."
                + " Use this OTP to proceed with resetting your password.";
        sendEmail(toEmail, subject, content);
    }

    public void SendOtpEmail(String toEmail, String otp) {
        String subject = "Account Verification OTP";
        String content = "Your OTP is: <b>" + otp + "</b>. Verify your account using this OTP.";
        sendEmail(toEmail, subject, content);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", brevoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("accept", "application/json");

        Map<String, Object> body = Map.of(
                "sender", Map.of("name", senderName, "email", senderEmail),
                "to", List.of(Map.of("email", toEmail)),
                "subject", subject,
                "htmlContent", htmlContent
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(brevoApiUrl, request, String.class);
            log.info("Email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send email via Brevo", e);
        }
    }
}