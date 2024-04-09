package org.ssv.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.ssv.database.AnalysisDatabase;
import org.ssv.service.AnalysisParser;
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


        public Analysis(String analysis) throws Exception {
            AnalysisParser analysisParser = AnalysisParser.builder().jsonContent(analysis).build(); //initialize the parser
            id = lastId++;
            name = analysisParser.extractName(analysis); //initialize the name of the analysis
            smells = new ArrayList<>();
            smells = analysisParser.parseContent(analysis); //initialize the list of smells

            AnalysisDatabase.getInstance().addAnalysis(this); //add the analysis to the database
        }

        public String toString() {
            return "Analysis{ " + smells + '}';
        }
    }
