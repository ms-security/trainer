package org.ssv.database;

import org.ssv.model.Analysis;

import java.util.ArrayList;
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

    public Analysis getAnalysis(int id) {
        return analysisHashMap.get(id);
    }

    public boolean removeAnalysis(int id) {
        return analysisHashMap.remove(id) != null;
    }

    public ArrayList<Analysis> getAllAnalyses() {
        return new ArrayList<>(analysisHashMap.values());
    }
}
