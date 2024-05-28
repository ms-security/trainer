package org.ssv.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.Analysis;

public interface AnalysisRepositoryJpa extends JpaRepository<Analysis, String>{

}
