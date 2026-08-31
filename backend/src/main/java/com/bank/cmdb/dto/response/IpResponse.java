package com.bank.cmdb.dto.response;

import com.bank.cmdb.entity.IpStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class IpResponse {
    private Long id;
    private String address;
    private String description;
    private IpStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
