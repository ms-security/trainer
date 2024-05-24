package org.ssv.service.database.jpaRepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.Analysis;
import org.ssv.model.Microservice;

import java.util.List;

public interface MicroserviceRepositoryJpa extends JpaRepository<Microservice, Integer> {
    // Fetch microservices by analysis
    List<Microservice> findByAnalysis(Analysis analysis);

    void deleteById(int id);
}

