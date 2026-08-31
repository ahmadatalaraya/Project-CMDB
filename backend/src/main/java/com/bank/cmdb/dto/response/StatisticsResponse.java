package com.bank.cmdb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class StatisticsResponse {
    private long totalApplications;
    private long totalGroups;
    private long totalIps;
}
