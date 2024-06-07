package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.Analysis;

/**
 * JPA Repository for Analysis entity
 * Extends JpaRepository
 */
public interface AnalysisRepositoryJpa extends JpaRepository<Analysis, String>{

}
