package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.Microservice;
import org.sst.model.Smell;
import org.sst.service.SmellId;

import java.util.List;

/**
 * JPA Repository for Smell entity
 * Extends JpaRepository
 * Uses object SmellId as the primary key
 */
public interface SmellRepositoryJpa extends JpaRepository<Smell, SmellId> {
    List<Smell> findByAnalysisId(String analysisId);

    List<Smell> findByMicroservice(Microservice microservice);
}

