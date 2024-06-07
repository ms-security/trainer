package org.sst.service.database;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.exception.DatabaseException;
import org.sst.exception.ResourceNotFoundException;
import org.sst.model.Analysis;
import org.sst.model.EffortTime;
import org.sst.model.Microservice;
import org.sst.model.Smell;
import org.sst.service.database.services.*;

import java.util.List;


/**
 * Service class acting as a facade for various database operations.
 * Provides methods to manage database access for analyses, microservices, smells,
 * quality attributes and effort times.
 */
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
    /**
     * Saves the given analysis in the persistent db.
     *
     * @param analysis the analysis to save
     * @throws DatabaseException if an error occurs while saving the analysis
     */
    public void saveAnalysis(Analysis analysis) {
        try {
            analysisService.saveAnalysis(analysis);
        } catch (Exception e) {
            throw new DatabaseException("Error saving analysis");
        }
    }

    /**
     * Retrieves all analyses from the persistent db.
     *
     * @return a list of all analyses
     * @throws DatabaseException if an error occurs while retrieving the analyses
     */
    public List<Analysis> getAllAnalyses() {
        try {
            return analysisService.getAllAnalyses();
        } catch (Exception e) {
            throw new DatabaseException("Error getting all analyses from database");
        }
    }

    /**
     * Retrieves the analysis with the given id from the persistent db.
     *
     * @param analysisId the id of the analysis to retrieve
     * @return the analysis with the given id
     * @throws ResourceNotFoundException if no analysis with the given id is found
     * @throws DatabaseException if an error occurs while retrieving the analysis
     */
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

    /**
     * Deletes the analysis with the given id from the persistent db.
     *
     * @param analysisId the id of the analysis to delete
     * @return true if the analysis was successfully deleted, false otherwise
     * @throws ResourceNotFoundException if no analysis with the given id is found
     * @throws DatabaseException if an error occurs while deleting the analysis
     */
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
    /**
     * Saves the given microservice in the persistent db.
     *
     * @param microservice the microservice to save
     * @throws DatabaseException if an error occurs while saving the microservice
     */
    public void saveMicroservice(Microservice microservice) {
        try {
            qualityAttributeService.saveQualityAttributes(microservice.getQualityAttributes());
            microserviceService.saveMicroservice(microservice);
        }catch (Exception e) {
            throw new DatabaseException("Error saving microservice");
        }
    }

    /**
     * Finds a microservice by its ID within a specific analysis.
     *
     * @param analysisId the ID of the analysis
     * @param microserviceId the ID of the microservice to find
     * @return the found microservice
     * @throws ResourceNotFoundException if the microservice is not found
     * @throws DatabaseException if an error occurs while finding the microservice
     */
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

    /**
     * Deletes the given microservice.
     *
     * @param microservice the microservice to delete
     * @return true if the microservice was successfully deleted, false otherwise
     * @throws ResourceNotFoundException if the microservice is not found
     * @throws DatabaseException if an error occurs while deleting the microservice
     */
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

    /**
     * Updates the given microservice with new values.
     *
     * @param microservice the microservice to update
     * @param microserviceTmp the temporary microservice containing new values
     * @throws DatabaseException if an error occurs while updating the microservice
     */
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
    /**
     * Finds a smell by its ID within a specific analysis.
     *
     * @param analysisId the ID of the analysis
     * @param smellId the ID of the smell to find
     * @return the found smell
     * @throws ResourceNotFoundException if the smell is not found
     * @throws DatabaseException if an error occurs while finding the smell
     */
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

    /**
     * Saves the given smell.
     *
     * @param smell the smell to save
     * @throws DatabaseException if an error occurs while saving the smell
     */
    public void saveSmell(Smell smell) {
        try {
            smellService.saveSmell(smell);
        } catch (Exception e) {
            throw new DatabaseException("Error saving smell");
        }
    }

    /**
     * Finds all smells associated with the given microservice.
     *
     * @param microservice the microservice whose smells are to be found
     * @return a list of smells associated with the microservice
     * @throws DatabaseException if an error occurs while finding the smells
     */
    public List<Smell> findByMicroservice(Microservice microservice) {
        try {
            return smellService.findByMicroservice(microservice);
        } catch (Exception e) {
            throw new DatabaseException("Error finding smells by microservice");
        }
    }

    //----------------EffortTime----------------
    /**
     * Saves the given effort time.
     *
     * @param effortTime the effort time to save
     * @throws DatabaseException if an error occurs while saving the effort time
     */
    public void saveEffortTime(EffortTime effortTime) {
        try {
            effortTimeService.saveEffortTime(effortTime);
        } catch (Exception e) {
            throw new DatabaseException("Error saving effort time");
        }
    }

}
