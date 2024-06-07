package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.QualityAttribute;

/**
 * JPA Repository for QualityAttribute entity
 * Extends JpaRepository
 */
public interface QualityAttributeRepositoryJpa extends JpaRepository<QualityAttribute, Integer> {
}
