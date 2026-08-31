package com.bank.cmdb.dto.response;

import com.bank.cmdb.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ApplicationDetailResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private ApplicationStatus status;
    private List<GroupResponse> groups;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
