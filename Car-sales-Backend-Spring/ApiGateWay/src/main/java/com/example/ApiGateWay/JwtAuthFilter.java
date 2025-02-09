package com.example.ApiGateWay;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.List;

@Component
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    private final Key secretKey;

    public JwtAuthFilter() {
        super(Config.class);
        // Convert secret string to valid HMAC key
        String secretString = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437"; // Ensure it's Base64 encoded
        this.secretKey = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return unauthorizedResponse(exchange, "Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(secretKey)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String role = claims.get("role", String.class);

                // Extract userId safely
                Object userIdObject = claims.get("userId");
                Long userId = null;
                if (userIdObject instanceof Integer) {
                    userId = ((Integer) userIdObject).longValue(); // Convert Integer to Long
                } else if (userIdObject instanceof Long) {
                    userId = (Long) userIdObject; // Use Long directly
                }

                String userName = claims.getSubject(); // Usually username or email

                // Propagate claims to downstream services
                exchange.getRequest().mutate()
                        .header("X-User-Id", userId != null ? userId.toString() : "") // Convert Long to String
                        .header("X-User-Role", role)
                        .header("X-User-Name", userName)
                        .build();

                return chain.filter(exchange);
            } catch (Exception e) {
                e.printStackTrace();
                return unauthorizedResponse(exchange, "Invalid JWT token: " + e.getMessage());
            }

        };
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    public static class Config {
        private List<String> allowedRoles;

        public List<String> getAllowedRoles() {
            return allowedRoles;
        }

        public void setAllowedRoles(List<String> allowedRoles) {
            this.allowedRoles = allowedRoles;
        }
    }
}