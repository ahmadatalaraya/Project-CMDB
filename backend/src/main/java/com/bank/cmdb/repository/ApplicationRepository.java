package com.bank.cmdb.repository;

import com.bank.cmdb.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByCodeIgnoreCase(String code);
}
