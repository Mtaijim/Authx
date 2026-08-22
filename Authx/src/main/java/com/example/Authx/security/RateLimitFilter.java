package com.example.Authx.security;

import com.example.Authx.services.RateLimitService;
import com.example.Authx.services.SuspiciousLoginService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper;
    private final JavaMailSender mailSender;
    @Override
    protected void doFilterInternal(HttpServletRequest request
            , HttpServletResponse response
            , FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String ip = extractIP(request);

        if("POST".equalsIgnoreCase(method) && uri.equals("/api/v1/auth/login")){
            Bucket bucket = rateLimitService.getLoginBucket(ip);

            if(!rateLimitService.tryConsume(bucket)){
                sendBlockedResponse(
                        response,
                        "Too many login attempts ."+
                                "please wait 15 min before trying again.",
                        rateLimitService.remainingTokens(bucket)
                );

                return ;
            }


        }
        filterChain.doFilter(request,response);
    }

    private void sendBlockedResponse(HttpServletResponse response,
                                     String message, long remaining) throws IOException {

    response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());

    response.setContentType(MediaType.APPLICATION_JSON_VALUE);


    response.setHeader("Cache-Control","no-store");
Map<String, Object> body = Map.of(
        "status" ,  429 ,
        "message",  message,
        "remainingAttempts",remaining

);
response.getWriter().write(
        objectMapper.writeValueAsString(body)
);

    }

    private String extractIP(HttpServletRequest request) {
String forwarded = request.getHeader("X-Forwarded-For");
if(forwarded != null && !forwarded.isBlank() && !"unknown".equalsIgnoreCase(forwarded)){
    return forwarded.split(",")[0].trim();
}
        String realIp = request.getHeader("X-Real-IP");
    if(realIp != null && !realIp.isBlank()){
        return realIp;
    }
    return request.getRemoteAddr();
    }

}
