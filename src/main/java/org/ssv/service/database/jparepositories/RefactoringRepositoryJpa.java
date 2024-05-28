package org.ssv.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.Refactoring;

public interface RefactoringRepositoryJpa extends JpaRepository<Refactoring, Integer> {
    // Additional queries can be added if required
}
