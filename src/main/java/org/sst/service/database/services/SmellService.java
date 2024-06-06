package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.service.SmellId;
import org.sst.service.database.jparepositories.SmellRepositoryJpa;
import org.sst.model.Microservice;
import org.sst.model.Smell;

import java.util.List;
import java.util.Optional;

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
    public List<Smell> findByAnalysis(String analysisId) {
        return smellRepository.findByAnalysisId(analysisId);
    }

    public Smell findSmellById(String analysisId, int id) {
        SmellId smellId = new SmellId(id, analysisId);
        Optional<Smell> smell = smellRepository.findById(smellId);
        return smell.orElse(null);
    }

    public List<Smell> findByMicroservice(Microservice microservice){
        return smellRepository.findByMicroservice(microservice);
    }
}

