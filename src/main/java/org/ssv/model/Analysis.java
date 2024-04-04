package org.ssv.model;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.ssv.service.AnalysisParser;
import java.util.ArrayList;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
public class Analysis {

    private String name;
    private List<Smell> smells;
    private int id;


    public Analysis(String analysis) throws Exception {
        id = 1;
        smells = new ArrayList<>();
        AnalysisParser analysisParser = AnalysisParser.builder().jsonContent(analysis).build(); //initialize the parser
        smells = analysisParser.parseContent(analysis); //initialize the list of smells
        name = analysisParser.extractName(analysis); //initialize the name of the analysis
    }

    public String toString() {
        return "Analysis{ " + smells + '}';
    }
}
