package org.ssv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.database.jpaRepositories.AnalysisRepositoryJpa;
import org.ssv.database.jpaRepositories.SmellRepositoryJpa;
import org.ssv.model.Analysis;

import java.util.List;
import java.util.Optional;

@Service
public class AnalysisService {
    @Autowired
    private AnalysisRepositoryJpa analysisRepository;

    @Autowired
    private SmellRepositoryJpa smellRepository;

    // Save an analysis and its associated smells
    public Analysis saveAnalysis(Analysis analysis) {
        try {
            analysisRepository.save(analysis);
        }
        catch (Exception e) {
            System.out.println("Error saving analysis: " + e.getMessage());
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

