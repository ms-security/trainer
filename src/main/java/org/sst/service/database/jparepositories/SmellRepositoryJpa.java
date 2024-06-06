package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.Microservice;
import org.sst.model.Smell;
import org.sst.service.SmellId;

import java.util.List;

public interface SmellRepositoryJpa extends JpaRepository<Smell, SmellId> {
    // Fetch smells associated with a particular analysis
    List<Smell> findByAnalysisId(String analysisId);

    List<Smell> findByMicroservice(Microservice microservice);
}

