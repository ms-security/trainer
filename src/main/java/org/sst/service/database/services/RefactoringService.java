package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.service.database.jparepositories.RefactoringRepositoryJpa;
import org.sst.model.Refactoring;

@Service
public class RefactoringService {
    @Autowired
    private RefactoringRepositoryJpa refactoringRepository;

    // Save a refactoring
    public Refactoring saveRefactoring(Refactoring refactoring) {
        return refactoringRepository.save(refactoring);
    }
}

