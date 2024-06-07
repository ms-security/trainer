package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.service.SmellId;
import org.sst.service.database.jparepositories.SmellRepositoryJpa;
import org.sst.model.Microservice;
import org.sst.model.Smell;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Smell entity.
 * This class is used to interact with the SmellRepositoryJpa.
 * It provides methods to save and fetch Smell objects.
 */
@Service
public class SmellService {
    @Autowired
    private SmellRepositoryJpa smellRepository;

    /**
     * Save a Smell object.
     * @param smell Smell object to be saved.
     * @return Smell object saved.
     */
    public Smell saveSmell(Smell smell) {
        return smellRepository.save(smell);
    }

    /**
     * Save a list of Smell objects.
     * @param smells List of Smell objects to be saved.
     * @return List of Smell objects saved.
     */
    public List<Smell> saveSmells(List<Smell> smells) {
        return smellRepository.saveAll(smells);
    }

    /**
     * Find all Smell objects of an Analysis.
     * @param analysisId Id of the Analysis.
     * @return List of Smell objects of the Analysis.
     */
    public List<Smell> findByAnalysis(String analysisId) {
        return smellRepository.findByAnalysisId(analysisId);
    }

    /**
     * Find a Smell object by its id.
     * @param analysisId Id of the Analysis.
     * @param id Id of the Smell.
     * @return Smell object found.
     */
    public Smell findSmellById(String analysisId, int id) {
        SmellId smellId = new SmellId(id, analysisId);
        Optional<Smell> smell = smellRepository.findById(smellId);
        return smell.orElse(null);
    }

    /**
     * Find all Smell objects with the Microservice object specified.
     * @param microservice Microservice associated to the list of Smell objects.
     * @return List of Smell objects associated with the Microservice.
     */
    public List<Smell> findByMicroservice(Microservice microservice){
        return smellRepository.findByMicroservice(microservice);
    }
}

