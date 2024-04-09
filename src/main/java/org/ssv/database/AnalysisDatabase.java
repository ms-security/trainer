package org.ssv.database;

import org.ssv.model.Analysis;

import java.util.HashMap;

public class AnalysisDatabase {
    private static AnalysisDatabase instance;
    private final HashMap<Integer, Analysis> analysisHashMap;

    private AnalysisDatabase() {
        analysisHashMap = new HashMap<>();
    }

    public static synchronized AnalysisDatabase getInstance() {
        if (instance == null) {
            instance = new AnalysisDatabase();
        }
        return instance;
    }

    public void addAnalysis(Analysis analysis) {
        analysisHashMap.put(analysis.getId(), analysis);
    }

    public Analysis getAnalysis(String id) {
        return analysisHashMap.get(id);
    }

    public void removeAnalysis(String id) {
        analysisHashMap.remove(id);
    }

    public HashMap<Integer, Analysis> getAllAnalyses() {
        return analysisHashMap;
    }
}
