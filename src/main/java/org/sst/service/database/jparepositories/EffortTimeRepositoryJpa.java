package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.EffortTime;

/**
 * JPA Repository for EffortTime entity
 * Extends JpaRepository
 */
public interface EffortTimeRepositoryJpa extends JpaRepository<EffortTime, Integer> {
}
