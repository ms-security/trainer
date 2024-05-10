package org.ssv.database.jpaRepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;

import java.util.List;

public interface SmellRepositoryJpa extends JpaRepository<Smell, Integer> {
    // Fetch smells associated with a particular analysis
    List<Smell> findByAnalysis(Analysis analysis);
}

