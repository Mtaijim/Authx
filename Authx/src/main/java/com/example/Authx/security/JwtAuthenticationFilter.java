package com.example.Authx.security;

import com.example.Authx.helper.UserHelper;
import com.example.Authx.repositories.userRepository;
import com.example.Authx.services.TokenBlacklistService;
import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.SpringSecurityCoreVersion;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {


    private final JwtService jwtService;
    private final userRepository userRepository;
    private Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final TokenBlacklistService tokenBlacklistService;


    @Override
    protected void doFilterInternal(HttpServletRequest request
            , HttpServletResponse response
            , FilterChain filterChain) throws ServletException, IOException {
  String header = request.getHeader("Authorization");
        logger.info("Authorization header : {}", header);

  if(header!=null && header.startsWith("Bearer ")) {


      String token = header.substring(7);

      try {

          if(!jwtService.isAccessToken(token)){
//          message pass
              filterChain.doFilter(request,response);
              return;
          }
// get jti from token
          String jti = jwtService.getJti(token);

//          is this token is blacklisted ?
          if(tokenBlacklistService.isBlacklisted(jti)){
              request.setAttribute(
                      "error","Token has been revoked"
              );
              filterChain.doFilter(request,response);
              return;
          }

          Jws<Claims> parse = jwtService.parse(token);
         Claims payload = parse.getPayload();
         String userid =  payload.getSubject();
  
          UUID userUuid = UserHelper.parseUUID(userid);

         userRepository.findById(userUuid).ifPresent( user-> {
//             check for user enabled or not
            if(user.isEnabled()){

             List<GrantedAuthority> authorities = user.getRoles() == null ? List.of() : user.getRoles().stream()
                     .map(role -> new SimpleGrantedAuthority(role.getName().name())).collect(Collectors.toList());

             UsernamePasswordAuthenticationToken authentication =
                     new UsernamePasswordAuthenticationToken(
                     user,
                     null,
                     authorities
             );
             authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                if(SecurityContextHolder.getContext().getAuthentication() ==null)
                    SecurityContextHolder.getContext().setAuthentication(authentication);
         }});



      } catch (ExpiredJwtException e) {
          request.setAttribute("error", "Token Expired");
      }  catch (Exception e){
          request.setAttribute("error", "Invalid Token");
      }
  }
  filterChain.doFilter(request,response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        return uri.startsWith("/api/v1/auth/login") ||
                uri.startsWith("/api/v1/auth/register") ||
                uri.startsWith("/api/v1/auth/forgot-password") ||
                uri.startsWith("/api/v1/auth/reset-password");
    }
}
