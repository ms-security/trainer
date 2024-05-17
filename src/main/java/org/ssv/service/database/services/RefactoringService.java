package org.ssv.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.service.database.jpaRepositories.RefactoringRepositoryJpa;
import org.ssv.model.Refactoring;

@Service
public class RefactoringService {
    @Autowired
    private RefactoringRepositoryJpa refactoringRepository;

    // Save a refactoring
    public Refactoring saveRefactoring(Refactoring refactoring) {
        return refactoringRepository.save(refactoring);
    }
}

