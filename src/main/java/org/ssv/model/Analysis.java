package org.ssv.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.ssv.database.AnalysisDatabaseSingleton;
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
            AnalysisParser analysisParser = AnalysisParser.builder().build(); //initialize the parser
            id = lastId++;
            name = analysisParser.extractName(analysis); //initialize the name of the analysis
            smells = new ArrayList<>();
            smells = analysisParser.parseContent(analysis); //initialize the list of smells
            isFavorite = false;
            isTriageValid = false;
            date = analysisParser.extractUploadDate(analysis); //initialize the upload date
            AnalysisDatabaseSingleton.getInstance().addAnalysis(this); //add the analysis to the database
        }

        public String toString() {
            return "Analysis{ " + smells + + id + " --" + name + " --" + date + " --" + isFavorite +'}';
        }
    }
