package org.ssv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.database.jpaRepositories.SmellRepositoryJpa;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;

import java.util.List;

@Service
public class SmellService {
    @Autowired
    private SmellRepositoryJpa smellRepository;

    // Save a single smell
    public Smell saveSmell(Smell smell) {
        return smellRepository.save(smell);
    }

    // Save a list of smells
    public List<Smell> saveSmells(List<Smell> smells) {
        return smellRepository.saveAll(smells);
    }

    // Fetch smells for a given analysis
    public List<Smell> findByAnalysis(Analysis analysis) {
        return smellRepository.findByAnalysis(analysis);
    }
}

