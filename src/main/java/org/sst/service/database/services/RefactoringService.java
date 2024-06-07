package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.service.database.jparepositories.RefactoringRepositoryJpa;
import org.sst.model.Refactoring;

/**
 * Service class for Refactoring entity.
 * This class is used to interact with the RefactoringRepositoryJpa.
 */
@Service
public class RefactoringService {
    @Autowired
    private RefactoringRepositoryJpa refactoringRepository;

    /**
     * Save a Refactoring object.
     * @param refactoring Refactoring object to be saved.
     * @return Refactoring object saved.
     */
    public Refactoring saveRefactoring(Refactoring refactoring) {
        return refactoringRepository.save(refactoring);
    }
}

