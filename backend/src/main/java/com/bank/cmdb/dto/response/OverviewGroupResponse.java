package com.bank.cmdb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class OverviewGroupResponse {
    private Long id;
    private String name;
    private List<OverviewIpResponse> ips;
}
