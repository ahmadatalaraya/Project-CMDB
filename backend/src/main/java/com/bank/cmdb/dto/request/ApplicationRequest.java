package com.bank.cmdb.dto.request;

import com.bank.cmdb.entity.ApplicationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicationRequest {

    @NotBlank(message = "Kode aplikasi wajib diisi")
    @Size(max = 100)
    private String code;

    @NotBlank(message = "Nama aplikasi wajib diisi")
    @Size(max = 150)
    private String name;

    @Size(max = 500)
    private String description;

    private ApplicationStatus status;
}
