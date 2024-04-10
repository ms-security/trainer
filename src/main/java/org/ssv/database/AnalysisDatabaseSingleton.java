package org.ssv.database;

import org.ssv.model.Analysis;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class AnalysisDatabaseSingleton {
    private static AnalysisDatabaseSingleton instance;
    private final HashMap<Integer, Analysis> analysisHashMap = new HashMap<>();

    private AnalysisDatabaseSingleton() {
    }

    public static synchronized AnalysisDatabaseSingleton getInstance() {
        if (instance == null) {
            instance = new AnalysisDatabaseSingleton();
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

    public List<Analysis> getAllAnalyses() {
        return new ArrayList<>(analysisHashMap.values());
    }
}
