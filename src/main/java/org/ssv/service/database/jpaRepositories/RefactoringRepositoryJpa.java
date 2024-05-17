package org.ssv.service.database.jpaRepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.Refactoring;

public interface RefactoringRepositoryJpa extends JpaRepository<Refactoring, Integer> {
    // Additional queries can be added if required
}
