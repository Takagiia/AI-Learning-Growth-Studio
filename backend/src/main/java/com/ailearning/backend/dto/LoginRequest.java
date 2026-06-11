package com.ailearning.backend.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "请输入账�?)
    private String username;

    @NotBlank(message = "请输入密�?)
    private String password;
}
