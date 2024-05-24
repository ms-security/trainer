package org.ssv.service.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.model.Analysis;
import org.ssv.model.EffortTime;
import org.ssv.model.Microservice;
import org.ssv.model.Smell;
import org.ssv.service.database.services.*;

import java.util.List;

@Service
public class FacadeService {

    @Autowired
    private AnalysisService analysisService;

    @Autowired
    private EffortTimeService effortTimeService;

    @Autowired
    private MicroserviceService microserviceService;

    @Autowired
    private RefactoringService refactoringService;

    @Autowired
    private SmellService smellService;

    @Autowired
    private QualityAttributeService qualityAttributeService;

    //----------------Analysis----------------

    public void saveAnalysis(Analysis analysis) {
        analysisService.saveAnalysis(analysis);
    }

    public List<Analysis> getAllAnalyses() {
        return analysisService.getAllAnalyses();
    }

    public Analysis findAnalysisById(String analysisId) {
        return analysisService.findById(analysisId);
    }

    public boolean deleteAnalysisById(String analysisId) {
        return analysisService.deleteById(analysisId);
    }

    //----------------Microservice----------------

    public void saveMicroservice(Microservice microservice) {
        qualityAttributeService.saveQualityAttributes(microservice.getQualityAttributes());
        microserviceService.saveMicroservice(microservice);
    }

    public Microservice findMicroserviceById(String analysisId, int microserviceId) {
        return microserviceService.findMicroserviceById(analysisId, microserviceId);
    }

    public boolean deleteMicroservice(Microservice microservice) {
        List<Smell> smells = smellService.findByMicroservice(microservice);
        for (Smell smell : smells) {
            smell.setMicroservice(null);
            smell.setUrgencyCode(null);
            smellService.saveSmell(smell);
        }
        qualityAttributeService.deleteQualityAttributeByMicroservice(microservice);
        return microserviceService.deleteMicroservice(microservice.getId());
    }

    public void updateMicroservice(Microservice microservice, Microservice microserviceTmp) {
        microservice.setName(microserviceTmp.getName());
        microservice.setRelevance(microserviceTmp.getRelevance());
        qualityAttributeService.deleteQualityAttributeByMicroservice(microservice);
        microservice.getQualityAttributes().clear();
        microservice.setQualityAttributes(microserviceTmp.getQualityAttributes());
        saveMicroservice(microservice);
    }

    //----------------Smell----------------

    public Smell findSmellById(String analysisId, int smellId) {
        return smellService.findSmellById(analysisId, smellId);
    }

    public void saveSmell(Smell smell) {
        smellService.saveSmell(smell);
    }

    public List<Smell> findByMicroservice(Microservice microservice) {
        return smellService.findByMicroservice(microservice);
    }

    //----------------EffortTime----------------

    public void saveEffortTime(EffortTime effortTime) {
        effortTimeService.saveEffortTime(effortTime);
    }

}
