package org.ssv.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssv.model.Analysis;
import org.ssv.service.database.jpaRepositories.AnalysisRepositoryJpa;

import java.util.List;
import java.util.Optional;

@Service
public class AnalysisService {

    @Autowired
    private AnalysisRepositoryJpa analysisRepository;

    @Transactional
    public void saveAnalysis(Analysis analysis) {
        try {
            analysisRepository.save(analysis);
        } catch (Exception e) {
            System.out.println("Error saving analysis: service problem -- " + e.getMessage());
            throw e;
        }
    }

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
}

