package com.bank.cmdb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class GroupDetailResponse {
    private Long id;
    private String name;
    private String description;
    private Long applicationId;
    private String applicationName;
    private List<IpResponse> ips;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
