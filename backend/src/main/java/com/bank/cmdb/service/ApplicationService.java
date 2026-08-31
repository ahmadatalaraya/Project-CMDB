package com.bank.cmdb.service;

import com.bank.cmdb.dto.request.ApplicationRequest;
import com.bank.cmdb.dto.response.ApplicationDetailResponse;
import com.bank.cmdb.dto.response.ApplicationOverviewResponse;
import com.bank.cmdb.dto.response.ApplicationResponse;
import com.bank.cmdb.dto.response.GroupResponse;
import com.bank.cmdb.dto.response.OverviewGroupResponse;
import com.bank.cmdb.dto.response.OverviewIpResponse;
import com.bank.cmdb.entity.Application;
import com.bank.cmdb.entity.ApplicationStatus;
import com.bank.cmdb.entity.Group;
import com.bank.cmdb.exception.DuplicateResourceException;
import com.bank.cmdb.exception.ResourceNotFoundException;
import com.bank.cmdb.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public List<ApplicationResponse> findAll() {
        return applicationRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ApplicationOverviewResponse> findAllOverview() {
        return applicationRepository.findAll().stream()
                .map(this::toOverviewResponse)
                .toList();
    }

    public ApplicationDetailResponse findById(Long id) {
        Application app = getEntity(id);
        List<GroupResponse> groups = app.getGroups().stream()
                .map(this::toGroupResponse)
                .toList();
        return new ApplicationDetailResponse(
                app.getId(), app.getCode(), app.getName(), app.getDescription(), app.getStatus(),
                groups, app.getCreatedAt(), app.getUpdatedAt()
        );
    }

    public ApplicationResponse create(ApplicationRequest request) {
        if (applicationRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new DuplicateResourceException("Kode aplikasi '" + request.getCode() + "' sudah digunakan");
        }
        Application app = new Application();
        app.setCode(request.getCode());
        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setStatus(request.getStatus() != null ? request.getStatus() : ApplicationStatus.ACTIVE);
        return toResponse(applicationRepository.save(app));
    }

    public ApplicationResponse update(Long id, ApplicationRequest request) {
        Application app = getEntity(id);
        if (!app.getCode().equalsIgnoreCase(request.getCode())
                && applicationRepository.existsByCodeIgnoreCase(request.getCode())) {
            throw new DuplicateResourceException("Kode aplikasi '" + request.getCode() + "' sudah digunakan");
        }
        app.setCode(request.getCode());
        app.setName(request.getName());
        app.setDescription(request.getDescription());
        app.setStatus(request.getStatus() != null ? request.getStatus() : app.getStatus());
        return toResponse(applicationRepository.save(app));
    }

    public void delete(Long id) {
        applicationRepository.delete(getEntity(id));
    }

    private Application getEntity(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aplikasi dengan id " + id + " tidak ditemukan"));
    }

    private ApplicationResponse toResponse(Application app) {
        return new ApplicationResponse(
                app.getId(), app.getCode(), app.getName(), app.getDescription(), app.getStatus(),
                app.getGroups().size(), app.getCreatedAt(), app.getUpdatedAt()
        );
    }

    private GroupResponse toGroupResponse(Group g) {
        return new GroupResponse(
                g.getId(), g.getName(), g.getDescription(),
                g.getApplication().getId(), g.getApplication().getName(),
                g.getIps().size(), g.getCreatedAt(), g.getUpdatedAt()
        );
    }

    private ApplicationOverviewResponse toOverviewResponse(Application app) {
        List<OverviewGroupResponse> groups = app.getGroups().stream()
                .map(g -> new OverviewGroupResponse(
                        g.getId(),
                        g.getName(),
                        g.getIps().stream()
                                .map(ip -> new OverviewIpResponse(ip.getId(), ip.getAddress(), ip.getStatus()))
                                .toList()
                ))
                .toList();
        return new ApplicationOverviewResponse(app.getId(), app.getCode(), app.getName(), app.getStatus(), groups);
    }
}
