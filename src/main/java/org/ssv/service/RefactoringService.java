package org.ssv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.database.jpaRepositories.RefactoringRepositoryJpa;
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

