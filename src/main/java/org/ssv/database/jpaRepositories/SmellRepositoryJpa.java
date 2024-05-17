package org.ssv.database.jpaRepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.Microservice;
import org.ssv.model.Smell;
import org.ssv.database.SmellId;

import java.util.List;

public interface SmellRepositoryJpa extends JpaRepository<Smell, SmellId> {
    // Fetch smells associated with a particular analysis
    List<Smell> findByAnalysisId(String analysisId);

    List<Smell> findByMicroservice(Microservice microservice);
}

