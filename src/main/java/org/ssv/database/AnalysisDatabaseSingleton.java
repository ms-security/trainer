package org.ssv.database;

import org.ssv.model.Analysis;
import org.ssv.model.Microservice;
import org.ssv.model.Smell;

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

    public void addMicroservice(int analysisId, Microservice microservice) {
        Analysis analysis = analysisHashMap.get(analysisId);
        if (analysis != null) {
            analysis.getMicroservices().add(microservice);
        }
    }

    public Microservice getMicroservice(int analysisId, String microserviceId) {
        Analysis analysis = analysisHashMap.get(analysisId);
        Microservice result = null;
        if (analysis != null) {
            for(Microservice microservice : analysis.getMicroservices()) {
                if(microservice.getName().equals(microserviceId)) {
                    result = microservice;
                }
            }
        }
        return result;
    }

    public boolean removeMicroservice(int analysisId, Microservice microservice) {
        Analysis analysis = analysisHashMap.get(analysisId);
        if (analysis != null) {
            return analysis.getMicroservices().remove(microservice);  // Ritorna true se il microservizio è stato rimosso
        }
        return false;
    }

    public Smell getSmell(int analysisId, int smellId) {
        Analysis analysis = analysisHashMap.get(analysisId);
        Smell result = null;
        if (analysis != null) {
            for(Smell smell : analysis.getSmells()) {
                if(smell.getId() == smellId) {
                    result = smell;
                }
            }
        }
        return result;
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
