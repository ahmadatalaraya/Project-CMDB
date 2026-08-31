package com.bank.cmdb.dto.response;

import com.bank.cmdb.entity.IpStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OverviewIpResponse {
    private Long id;
    private String address;
    private IpStatus status;
}
