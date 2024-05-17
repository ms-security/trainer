package org.ssv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssv.database.jpaRepositories.*;
import org.ssv.model.Analysis;
import org.ssv.model.Microservice;
import org.ssv.model.QualityAttribute;
import org.ssv.model.Smell;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AnalysisService {
    @Autowired
    private AnalysisRepositoryJpa analysisRepository;

    @Autowired
    private SmellRepositoryJpa smellRepository;

    @Autowired
    private MicroserviceRepositoryJpa microserviceRepository;

    @Autowired
    private RefactoringRepositoryJpa refactoringRepository;

    @Autowired
    private EffortTimeRepositoryJpa effortTimeRepository;

    @Autowired
    private QualityAttributeRepositoryJpa qualityAttributeRepository;

    @Transactional
    public void saveAnalysis(Analysis analysis) {
        try {
            // Salva l'analisi, Hibernate dovrebbe gestire automaticamente il salvataggio delle entità correlate
            analysisRepository.save(analysis);
        } catch (Exception e) {
            System.out.println("Error saving analysis: service problem -- " + e.getMessage());
            throw e;
        }
    }

   /* @Transactional
    public void saveAnalysis(Analysis analysis) {
        try {
            analysisRepository.save(analysis);
            try {
                for (Smell smell : analysis.getSmells()) {
                    if (smell.getRefactoring() != null && smell.getRefactoring().getPropertiesAffected() != null) {
                        for (QualityAttribute qa : smell.getRefactoring().getPropertiesAffected()) {
                            if (qa.getId() == 0) {  // Verifica se l'id non è già impostato
                                qualityAttributeRepository.save(qa);
                            }
                        }
                        for (QualityAttribute qa : smell.getPropertiesAffected()) {
                            if (qa.getId() == 0) {  // Verifica se l'id non è già impostato
                                qualityAttributeRepository.save(qa);
                            }
                        }
                        refactoringRepository.save(smell.getRefactoring());
                    }
                    smellRepository.save(smell);
                }
            }
            catch (Exception e) {
                System.out.println("Error saving smells: service problem -- " + e.getMessage());
            }
        }
        catch (Exception e) {
            System.out.println("Error saving analysis: service problem -- " + e.getMessage());
        }
    }*/

    // Get all analyses
    public List<Analysis> getAllAnalyses() {
        return analysisRepository.findAll();
    }

    // Find analysis by ID
    public Analysis findById(String id) {
        Optional<Analysis> analysis = analysisRepository.findById(id);
        return analysis.orElse(null);
    }

    // Delete an analysis by ID
    public boolean deleteById(String id) {
        boolean existsBeforeDelete = analysisRepository.existsById(id);
        if (existsBeforeDelete) {
            analysisRepository.deleteById(id);
            return !analysisRepository.existsById(id);
        }
        return false;
    }

    public Smell findSmellById(String analysisId, int id) {
        Analysis analysis = findById(analysisId);
        if (analysis != null) {
            for (Smell smell : analysis.getSmells()) {
                if (smell.getId() == id) {
                    return smell;
                }
            }
        }
        return null;
    }

    public void saveSmell(Smell smell) {
        try{
            smellRepository.save(smell);
        }
        catch (Exception e) {
            System.out.println("Error saving smell: service problem -- " + e.getMessage());
        }
    }

    public void saveEffortTime(Smell smell){
        try{
            effortTimeRepository.save(smell.getEffortTime());
            saveSmell(smell);
        }
        catch (Exception e) {
            System.out.println("Error saving effort time: service problem -- " + e.getMessage());
        }
    }

    public void saveMicroservice(Microservice microservice) {
        System.out.println("Saving microservice: " + microservice.getQualityAttributes());
        try{
            qualityAttributeRepository.saveAll(microservice.getQualityAttributes());
            microserviceRepository.save(microservice);
            analysisRepository.save(microservice.getAnalysis());
        }
        catch (Exception e) {
            System.out.println("Error saving microservice: service problem -- " + e.getMessage());
        }
    }

    public Microservice findMicroserviceById(String analysisId, String microserviceId) {
        Analysis analysis = findById(analysisId);
        if (analysis != null) {
            for (Microservice microservice : analysis.getMicroservices()) {
                if (microservice.getName().equals(microserviceId)) {
                    return microservice;
                }
            }
        }
        return null;
    }

    @Transactional
    public boolean deleteMicroservice(String microserviceId) {
        Optional<Microservice> microserviceOpt = microserviceRepository.findById(microserviceId);
        if (microserviceOpt.isPresent()) {
            Microservice microservice = microserviceOpt.get();
            List<Smell> smells = smellRepository.findByMicroservice(microservice);
            for (Smell smell : smells) {
                smell.setMicroservice(null);
                smell.setUrgencyCode(null);
                smellRepository.save(smell);
            }
            microserviceRepository.deleteById(microserviceId);
            return !microserviceRepository.existsById(microserviceId);
        }
        return false;
    }
}

