package com.bank.cmdb.dto.request;

import com.bank.cmdb.entity.IpStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IpRequest {

    @NotBlank(message = "Alamat IP wajib diisi")
    @Pattern(
        regexp = "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
        message = "Format alamat IP tidak valid"
    )
    private String address;

    @Size(max = 500)
    private String description;

    private IpStatus status;
}
