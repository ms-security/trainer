package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.Analysis;
import org.sst.model.Microservice;

import java.util.List;

/**
 * JPA Repository for Microservice entity
 * Extends JpaRepository
 */
public interface MicroserviceRepositoryJpa extends JpaRepository<Microservice, Integer> {
    List<Microservice> findByAnalysis(Analysis analysis);

    void deleteById(int id);
}

