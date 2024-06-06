package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.Analysis;

public interface AnalysisRepositoryJpa extends JpaRepository<Analysis, String>{

}
