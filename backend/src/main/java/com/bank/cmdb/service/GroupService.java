package com.bank.cmdb.service;

import com.bank.cmdb.dto.request.GroupRequest;
import com.bank.cmdb.dto.response.GroupDetailResponse;
import com.bank.cmdb.dto.response.GroupResponse;
import com.bank.cmdb.dto.response.IpResponse;
import com.bank.cmdb.entity.Application;
import com.bank.cmdb.entity.Group;
import com.bank.cmdb.entity.Ip;
import com.bank.cmdb.exception.ResourceNotFoundException;
import com.bank.cmdb.repository.ApplicationRepository;
import com.bank.cmdb.repository.GroupRepository;
import com.bank.cmdb.repository.IpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GroupService {

    private final GroupRepository groupRepository;
    private final ApplicationRepository applicationRepository;
    private final IpRepository ipRepository;

    public List<GroupResponse> findByApplication(Long applicationId) {
        List<Group> groups = applicationId == null
                ? groupRepository.findAll()
                : groupRepository.findByApplicationId(applicationId);
        return groups.stream().map(this::toResponse).toList();
    }

    public GroupDetailResponse findById(Long id) {
        return toDetailResponse(getEntity(id));
    }

    public GroupResponse create(GroupRequest request) {
        Application app = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Aplikasi dengan id " + request.getApplicationId() + " tidak ditemukan"));
        Group group = new Group();
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        group.setApplication(app);
        return toResponse(groupRepository.save(group));
    }

    public GroupResponse update(Long id, GroupRequest request) {
        Group group = getEntity(id);
        if (!group.getApplication().getId().equals(request.getApplicationId())) {
            Application app = applicationRepository.findById(request.getApplicationId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Aplikasi dengan id " + request.getApplicationId() + " tidak ditemukan"));
            group.setApplication(app);
        }
        group.setName(request.getName());
        group.setDescription(request.getDescription());
        return toResponse(groupRepository.save(group));
    }

    public void delete(Long id) {
        groupRepository.delete(getEntity(id));
    }

    public GroupDetailResponse assignIp(Long groupId, Long ipId) {
        Group group = getEntity(groupId);
        Ip ip = ipRepository.findById(ipId)
                .orElseThrow(() -> new ResourceNotFoundException("IP dengan id " + ipId + " tidak ditemukan"));
        group.getIps().add(ip);
        groupRepository.save(group);
        return toDetailResponse(group);
    }

    public GroupDetailResponse removeIp(Long groupId, Long ipId) {
        Group group = getEntity(groupId);
        Ip ip = ipRepository.findById(ipId)
                .orElseThrow(() -> new ResourceNotFoundException("IP dengan id " + ipId + " tidak ditemukan"));
        group.getIps().remove(ip);
        groupRepository.save(group);
        return toDetailResponse(group);
    }

    private Group getEntity(Long id) {
        return groupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group dengan id " + id + " tidak ditemukan"));
    }

    private GroupResponse toResponse(Group g) {
        return new GroupResponse(
                g.getId(), g.getName(), g.getDescription(),
                g.getApplication().getId(), g.getApplication().getName(),
                g.getIps().size(), g.getCreatedAt(), g.getUpdatedAt()
        );
    }

    private GroupDetailResponse toDetailResponse(Group g) {
        List<IpResponse> ips = g.getIps().stream()
                .map(ip -> new IpResponse(ip.getId(), ip.getAddress(), ip.getDescription(), ip.getStatus(), ip.getCreatedAt(), ip.getUpdatedAt()))
                .toList();
        return new GroupDetailResponse(
                g.getId(), g.getName(), g.getDescription(),
                g.getApplication().getId(), g.getApplication().getName(),
                ips, g.getCreatedAt(), g.getUpdatedAt()
        );
    }
}
