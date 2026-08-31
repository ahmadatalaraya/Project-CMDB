package com.bank.cmdb.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupRequest {

    @NotBlank(message = "Nama group wajib diisi")
    @Size(max = 150)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull(message = "Aplikasi wajib dipilih")
    private Long applicationId;
}
