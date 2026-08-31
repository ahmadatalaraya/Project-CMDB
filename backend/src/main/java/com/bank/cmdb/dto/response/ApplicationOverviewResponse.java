package com.bank.cmdb.dto.response;

import com.bank.cmdb.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ApplicationOverviewResponse {
    private Long id;
    private String code;
    private String name;
    private ApplicationStatus status;
    private List<OverviewGroupResponse> groups;
}
