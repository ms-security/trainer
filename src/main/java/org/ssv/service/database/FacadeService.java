package org.ssv.service.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.exception.DatabaseException;
import org.ssv.exception.ResourceNotFoundException;
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
    private SmellService smellService;

    @Autowired
    private QualityAttributeService qualityAttributeService;

    //----------------Analysis----------------

    public void saveAnalysis(Analysis analysis) {
        try {
            analysisService.saveAnalysis(analysis);
        } catch (Exception e) {
            throw new DatabaseException("Error saving analysis");
        }
    }

    public List<Analysis> getAllAnalyses() {
        try {
            return analysisService.getAllAnalyses();
        } catch (Exception e) {
            throw new DatabaseException("Error getting all analyses from database");
        }
    }

    public Analysis findAnalysisById(String analysisId) {
        try {
            Analysis analysis = analysisService.findById(analysisId);
            if (analysis == null) {
                throw new ResourceNotFoundException("Analysis not found with id " + analysisId);
            }
            return analysis;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("Error finding analysis by id");
        }
    }

    public boolean deleteAnalysisById(String analysisId) {
        try {
            if (!analysisService.deleteById(analysisId)) {
                throw new ResourceNotFoundException("Analysis not found with id " + analysisId);
            }
            return true;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("Error deleting analysis by id");
        }
    }

    //----------------Microservice----------------

    public void saveMicroservice(Microservice microservice) {
        try {
            qualityAttributeService.saveQualityAttributes(microservice.getQualityAttributes());
            microserviceService.saveMicroservice(microservice);
        }catch (Exception e) {
            throw new DatabaseException("Error saving microservice");
        }
    }

    public Microservice findMicroserviceById(String analysisId, int microserviceId) {
        try {
            Microservice microservice = microserviceService.findMicroserviceById(microserviceId);
            if (microservice == null) {
                throw new ResourceNotFoundException("Microservice not found with id " + microserviceId + " in analysis " + analysisId);
            }
            return microservice;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("Error finding microservice by id");
        }
    }

    public boolean deleteMicroservice(Microservice microservice) {
        try {
            List<Smell> smells = smellService.findByMicroservice(microservice);
            for (Smell smell : smells) {
                smell.setMicroservice(null);
                smell.setUrgencyCode(null);
                smellService.saveSmell(smell);
            }
            qualityAttributeService.deleteQualityAttributeByMicroservice(microservice);
            if (!microserviceService.deleteMicroservice(microservice.getId())) {
                throw new ResourceNotFoundException("Microservice not found with id " + microservice.getId() + " in analysis " + microservice.getAnalysis().getId());
            }
            return true;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("Error deleting microservice");
        }
    }

    public void updateMicroservice(Microservice microservice, Microservice microserviceTmp) {
        try {
            microservice.setName(microserviceTmp.getName());
            microservice.setRelevance(microserviceTmp.getRelevance());
            qualityAttributeService.deleteQualityAttributeByMicroservice(microservice);
            microservice.getQualityAttributes().clear();
            microservice.setQualityAttributes(microserviceTmp.getQualityAttributes());
            saveMicroservice(microservice);
        } catch (Exception e) {
            throw new DatabaseException("Error updating microservice");
        }
    }

    //----------------Smell----------------

    public Smell findSmellById(String analysisId, int smellId) {
        try {
            Smell smell = smellService.findSmellById(analysisId, smellId);
            if (smell == null) {
                throw new ResourceNotFoundException("Smell not found with id " + smellId + " in analysis " + analysisId);
            }
            return smell;
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new DatabaseException("Error finding smell by id");
        }
    }

    public void saveSmell(Smell smell) {
        try {
            smellService.saveSmell(smell);
        } catch (Exception e) {
            throw new DatabaseException("Error saving smell");
        }
    }

    public List<Smell> findByMicroservice(Microservice microservice) {
        try {
            return smellService.findByMicroservice(microservice);
        } catch (Exception e) {
            throw new DatabaseException("Error finding smells by microservice");
        }
    }

    //----------------EffortTime----------------

    public void saveEffortTime(EffortTime effortTime) {
        try {
            effortTimeService.saveEffortTime(effortTime);
        } catch (Exception e) {
            throw new DatabaseException("Error saving effort time");
        }
    }

}
