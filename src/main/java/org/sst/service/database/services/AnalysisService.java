package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.sst.model.Analysis;
import org.sst.service.database.jparepositories.AnalysisRepositoryJpa;

import java.util.List;
import java.util.Optional;

/**
 * Service class for Analysis entity.
 * This class is used to interact with the AnalysisRepositoryJpa.
 * It provides methods to save, get all, find by ID and delete by ID.
 */
@Service
public class AnalysisService {

    @Autowired
    private AnalysisRepositoryJpa analysisRepository;

    /**
     * Save an analysis.
     * @param analysis The analysis to save.
     */
    @Transactional
    public void saveAnalysis(Analysis analysis) {
        analysisRepository.save(analysis);
    }

    /**
     * Get all analyses.
     * @return List of all analyses.
     */
    public List<Analysis> getAllAnalyses() {
        return analysisRepository.findAll();
    }

    /**
     * Find an analysis by ID.
     * @param id The ID of the analysis to find.
     * @return The analysis if found, null otherwise.
     */
    public Analysis findById(String id) {
        Optional<Analysis> analysis = analysisRepository.findById(id);
        return analysis.orElse(null);
    }

    /**
     * Delete an analysis by ID.
     * @param id The ID of the analysis to delete.
     * @return True if the analysis was deleted, false otherwise.
     */
    public boolean deleteById(String id) {
        boolean existsBeforeDelete = analysisRepository.existsById(id);
        if (existsBeforeDelete) {
            analysisRepository.deleteById(id);
            return !analysisRepository.existsById(id);
        }
        return false;
    }
}

