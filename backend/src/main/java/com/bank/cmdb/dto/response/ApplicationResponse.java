package com.bank.cmdb.dto.response;

import com.bank.cmdb.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class ApplicationResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private ApplicationStatus status;
    private int totalGroups;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
