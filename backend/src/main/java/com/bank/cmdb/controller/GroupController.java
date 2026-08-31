package com.bank.cmdb.controller;

import com.bank.cmdb.dto.request.GroupRequest;
import com.bank.cmdb.dto.response.GroupDetailResponse;
import com.bank.cmdb.dto.response.GroupResponse;
import com.bank.cmdb.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;

    @GetMapping
    public List<GroupResponse> findByApplication(@RequestParam(required = false) Long applicationId) {
        return groupService.findByApplication(applicationId);
    }

    @GetMapping("/{id}")
    public GroupDetailResponse findById(@PathVariable Long id) {
        return groupService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GroupResponse create(@Valid @RequestBody GroupRequest request) {
        return groupService.create(request);
    }

    @PutMapping("/{id}")
    public GroupResponse update(@PathVariable Long id, @Valid @RequestBody GroupRequest request) {
        return groupService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        groupService.delete(id);
    }

    @PostMapping("/{groupId}/ips/{ipId}")
    public GroupDetailResponse assignIp(@PathVariable Long groupId, @PathVariable Long ipId) {
        return groupService.assignIp(groupId, ipId);
    }

    @DeleteMapping("/{groupId}/ips/{ipId}")
    public GroupDetailResponse removeIp(@PathVariable Long groupId, @PathVariable Long ipId) {
        return groupService.removeIp(groupId, ipId);
    }
}
