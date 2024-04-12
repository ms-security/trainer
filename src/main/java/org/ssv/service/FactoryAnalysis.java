package org.ssv.service;

import org.ssv.model.Analysis;
import org.ssv.model.Smell;

import java.time.LocalDateTime;
import java.util.List;

public class FactoryAnalysis {
    private static FactoryAnalysis instance;
    private AnalysisParser parser = new AnalysisParser();

    private FactoryAnalysis(){};

    public static synchronized FactoryAnalysis getInstance() {
        if (instance == null) {
            instance = new FactoryAnalysis();
        }
        return instance;
    }

    public Analysis createAnalysis(String fileContent, String name, String dateString) throws Exception {
        List<Smell> smells = parser.parseContent(fileContent);
        LocalDateTime date = parser.extractUploadDate(dateString); // Usare il metodo del parser per la coerenza
        return new Analysis(name, smells, date);
    }
}
