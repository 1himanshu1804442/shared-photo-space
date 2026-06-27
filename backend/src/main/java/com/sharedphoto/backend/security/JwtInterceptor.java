package com.sharedphoto.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        
        // CORS preflight requests should pass
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String phone = jwtUtil.getPhoneNumberFromToken(token);
                if (phone != null && jwtUtil.validateToken(token, phone)) {
                    // Token is valid, set phone number in request attributes for controllers to use
                    request.setAttribute("userPhone", phone);
                    return true;
                }
            } catch (Exception e) {
                // Invalid token
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Unauthorized: Missing or invalid token");
        return false;
    }
}
