package org.ssv.service.database.jpaRepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.Analysis;

import java.util.List;

public interface AnalysisRepositoryJpa extends JpaRepository<Analysis, String>{

}
