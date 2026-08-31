package com.bank.cmdb.service;

import com.bank.cmdb.dto.request.IpRequest;
import com.bank.cmdb.dto.response.IpResponse;
import com.bank.cmdb.entity.Ip;
import com.bank.cmdb.entity.IpStatus;
import com.bank.cmdb.exception.DuplicateResourceException;
import com.bank.cmdb.exception.ResourceNotFoundException;
import com.bank.cmdb.repository.IpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class IpService {

    private final IpRepository ipRepository;

    public List<IpResponse> findAll() {
        return ipRepository.findAll().stream().map(this::toResponse).toList();
    }

    public IpResponse findById(Long id) {
        return toResponse(getEntity(id));
    }

    public IpResponse create(IpRequest request) {
        if (ipRepository.existsByAddress(request.getAddress())) {
            throw new DuplicateResourceException("Alamat IP '" + request.getAddress() + "' sudah terdaftar");
        }
        Ip ip = new Ip();
        ip.setAddress(request.getAddress());
        ip.setDescription(request.getDescription());
        ip.setStatus(request.getStatus() != null ? request.getStatus() : IpStatus.ACTIVE);
        return toResponse(ipRepository.save(ip));
    }

    public IpResponse update(Long id, IpRequest request) {
        Ip ip = getEntity(id);
        if (!ip.getAddress().equals(request.getAddress()) && ipRepository.existsByAddress(request.getAddress())) {
            throw new DuplicateResourceException("Alamat IP '" + request.getAddress() + "' sudah terdaftar");
        }
        ip.setAddress(request.getAddress());
        ip.setDescription(request.getDescription());
        ip.setStatus(request.getStatus() != null ? request.getStatus() : ip.getStatus());
        return toResponse(ipRepository.save(ip));
    }

    public void delete(Long id) {
        ipRepository.delete(getEntity(id));
    }

    Ip getEntity(Long id) {
        return ipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("IP dengan id " + id + " tidak ditemukan"));
    }

    private IpResponse toResponse(Ip ip) {
        return new IpResponse(
                ip.getId(), ip.getAddress(), ip.getDescription(), ip.getStatus(), ip.getCreatedAt(), ip.getUpdatedAt()
        );
    }
}
