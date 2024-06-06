package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.sst.model.Analysis;
import org.sst.service.database.jparepositories.AnalysisRepositoryJpa;

import java.util.List;
import java.util.Optional;

@Service
public class AnalysisService {

    @Autowired
    private AnalysisRepositoryJpa analysisRepository;

    @Transactional
    public void saveAnalysis(Analysis analysis) {
        analysisRepository.save(analysis);
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

