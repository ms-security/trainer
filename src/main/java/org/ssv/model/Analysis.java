package org.ssv.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.ssv.database.AnalysisDatabase;
import org.ssv.service.AnalysisParser;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

    @Data
    @SuperBuilder
    @NoArgsConstructor
    public class Analysis {

        private String name;
        private List<Smell> smells;
        private static int lastId = 0;
        private int id;
        @JsonProperty("isFavorite")
        private boolean isFavorite;
        @JsonProperty("isTriageValid")
        private boolean isTriageValid;

        private LocalDateTime date;

        public Analysis(String analysis) throws Exception {
            AnalysisParser analysisParser = AnalysisParser.builder().jsonContent(analysis).build(); //initialize the parser
            id = lastId++;
            name = analysisParser.extractName(analysis); //initialize the name of the analysis
            smells = new ArrayList<>();
            smells = analysisParser.parseContent(analysis); //initialize the list of smells
            isFavorite = false;
            isTriageValid = false;
            AnalysisDatabase.getInstance().addAnalysis(this); //add the analysis to the database
            date = analysisParser.extractUploadDate(analysis); //initialize the upload date
        }

        public String toString() {
            return "Analysis{ " + smells + '}';
        }
    }
