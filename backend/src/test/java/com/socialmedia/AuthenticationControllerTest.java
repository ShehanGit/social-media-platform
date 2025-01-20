package com.socialmedia;

import com.socialmedia.auth.AuthenticationRequest;
import com.socialmedia.auth.AuthenticationResponse;
import com.socialmedia.auth.AuthenticationService;
import com.socialmedia.auth.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationService authenticationService;

    @Test
    public void testRegisterEndpoint() throws Exception {
        // Create a sample register request
        RegisterRequest request = RegisterRequest.builder()
                .firstname("John")
                .lastname("Doe")
                .email("john@example.com")
                .password("password123")
                .build();

        // Mock the service response
        AuthenticationResponse mockResponse = AuthenticationResponse.builder()
                .token("mock-jwt-token")
                .build();

        when(authenticationService.register(any(RegisterRequest.class)))
                .thenReturn(mockResponse);

        // Perform the request and verify
        mockMvc.perform(post("/api/v1/auth/user_register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    public void testAuthenticateEndpoint() throws Exception {
        // Create a sample authentication request
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();

        // Mock the service response
        AuthenticationResponse mockResponse = AuthenticationResponse.builder()
                .token("mock-jwt-token")
                .build();

        when(authenticationService.authenticate(any(AuthenticationRequest.class)))
                .thenReturn(mockResponse);

        // Perform the request and verify
        mockMvc.perform(post("/api/v1/auth/authenticate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
