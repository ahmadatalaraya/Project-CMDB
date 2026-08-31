package com.bank.cmdb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class GroupResponse {
    private Long id;
    private String name;
    private String description;
    private Long applicationId;
    private String applicationName;
    private int totalIps;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
