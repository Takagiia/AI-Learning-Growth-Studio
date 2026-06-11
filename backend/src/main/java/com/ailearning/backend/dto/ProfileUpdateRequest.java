package com.ailearning.backend.dto;

import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateRequest {
    @NotBlank(message = "昵称不能为空")
    private String nickname;

    private String signature;
    private String avatar;
}
