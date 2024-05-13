package org.ssv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.database.jpaRepositories.*;
import org.ssv.model.Analysis;
import org.ssv.model.Microservice;
import org.ssv.model.QualityAttribute;
import org.ssv.model.Smell;

import javax.transaction.Transactional;
import java.util.List;
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

    public Analysis saveAnalysis(Analysis analysis) {
        try {
            analysisRepository.save(analysis);
            try {
                int count = 0;
                for (Smell smell : analysis.getSmells()) {
                    // Prima salva le QualityAttribute associate al Refactoring
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
                        // Salva il Refactoring dopo aver salvato le QualityAttribute
                        refactoringRepository.save(smell.getRefactoring());
                    }

                    // Ora salva il Smell
                    smellRepository.save(smell);
                }
                System.out.println("Saved " + count + " smells");
            }
            catch (Exception e) {
                System.out.println("Error saving smells: service problem -- " + e.getMessage());
            }
            /*
            // Ensure microservices are also managed similarly if they are not managed elsewhere
            for (Microservice microservice : analysis.getMicroservices()) {
                if (microservice.getId() == 0 || microserviceRepository.findById(microservice.getId()).isEmpty()) {
                    microserviceRepository.save(microservice);
                }
            }*/
        }
        catch (Exception e) {
            System.out.println("Error saving analysis: service problem -- " + e.getMessage());
        }
        return null;
    }

    // Get all analyses
    public List<Analysis> getAllAnalyses() {
        return analysisRepository.findAll();
    }

    // Find analysis by ID
    public Optional<Analysis> findById(String id) {
        return analysisRepository.findById(id);
    }

    // Delete an analysis by ID
    public void deleteById(String id) {
        analysisRepository.deleteById(id);
    }
}

