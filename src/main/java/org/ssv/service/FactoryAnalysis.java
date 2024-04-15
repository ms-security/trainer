package org.ssv.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;
import org.ssv.service.util.ContentParser;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

public class FactoryAnalysis {
    private static FactoryAnalysis instance;
    private ContentParser parser;  // Strategy interface

    private FactoryAnalysis(){ };

    public static synchronized FactoryAnalysis getInstance() {
        if (instance == null) {
            instance = new FactoryAnalysis();
        }
        return instance;
    }

    public Analysis createAnalysis(ContentParser parser, String fileContent, String name, String dateString) throws Exception {
        List<Smell> smells = parser.parseContent(fileContent);
        LocalDateTime date = extractUploadDate(dateString);
        return new Analysis(name, smells, date);
    }

    public LocalDateTime extractUploadDate(String date) throws JsonProcessingException {
        Instant instant = Instant.parse(date); //parse the date as an Instant
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault()); //convert the Instant to a LocalDateTime
    }
}
