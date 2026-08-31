package com.bank.cmdb.repository;

import com.bank.cmdb.entity.Ip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IpRepository extends JpaRepository<Ip, Long> {
    boolean existsByAddress(String address);
}
