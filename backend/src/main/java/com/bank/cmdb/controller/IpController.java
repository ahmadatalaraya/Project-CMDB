package com.bank.cmdb.controller;

import com.bank.cmdb.dto.request.IpRequest;
import com.bank.cmdb.dto.response.IpResponse;
import com.bank.cmdb.service.IpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ips")
@RequiredArgsConstructor
public class IpController {

    private final IpService ipService;

    @GetMapping
    public List<IpResponse> findAll() {
        return ipService.findAll();
    }

    @GetMapping("/{id}")
    public IpResponse findById(@PathVariable Long id) {
        return ipService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public IpResponse create(@Valid @RequestBody IpRequest request) {
        return ipService.create(request);
    }

    @PutMapping("/{id}")
    public IpResponse update(@PathVariable Long id, @Valid @RequestBody IpRequest request) {
        return ipService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        ipService.delete(id);
    }
}
