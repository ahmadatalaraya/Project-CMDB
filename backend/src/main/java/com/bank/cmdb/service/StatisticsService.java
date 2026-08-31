package com.bank.cmdb.service;

import com.bank.cmdb.dto.response.StatisticsResponse;
import com.bank.cmdb.repository.ApplicationRepository;
import com.bank.cmdb.repository.GroupRepository;
import com.bank.cmdb.repository.IpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsService {

    private final ApplicationRepository applicationRepository;
    private final GroupRepository groupRepository;
    private final IpRepository ipRepository;

    public StatisticsResponse getStatistics() {
        return new StatisticsResponse(
                applicationRepository.count(),
                groupRepository.count(),
                ipRepository.count()
        );
    }
}
