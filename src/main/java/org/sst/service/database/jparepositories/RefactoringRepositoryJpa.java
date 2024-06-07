package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.Refactoring;

/**
 * JPA Repository for Refactoring entity
 * Extends JpaRepository
 */
public interface RefactoringRepositoryJpa extends JpaRepository<Refactoring, Integer> {
    // Additional queries can be added if required
}
