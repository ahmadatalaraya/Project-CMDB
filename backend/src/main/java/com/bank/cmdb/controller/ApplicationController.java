package com.bank.cmdb.controller;

import com.bank.cmdb.dto.request.ApplicationRequest;
import com.bank.cmdb.dto.response.ApplicationDetailResponse;
import com.bank.cmdb.dto.response.ApplicationOverviewResponse;
import com.bank.cmdb.dto.response.ApplicationResponse;
import com.bank.cmdb.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    public List<ApplicationResponse> findAll() {
        return applicationService.findAll();
    }

    @GetMapping("/overview")
    public List<ApplicationOverviewResponse> findAllOverview() {
        return applicationService.findAllOverview();
    }

    @GetMapping("/{id}")
    public ApplicationDetailResponse findById(@PathVariable Long id) {
        return applicationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationResponse create(@Valid @RequestBody ApplicationRequest request) {
        return applicationService.create(request);
    }

    @PutMapping("/{id}")
    public ApplicationResponse update(@PathVariable Long id, @Valid @RequestBody ApplicationRequest request) {
        return applicationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        applicationService.delete(id);
    }
}
