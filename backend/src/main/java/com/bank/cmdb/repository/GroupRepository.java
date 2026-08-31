package com.bank.cmdb.repository;

import com.bank.cmdb.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByApplicationId(Long applicationId);
}
