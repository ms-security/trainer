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

        public Analysis(String name, List<Smell> smells, LocalDateTime date) throws Exception {
            id = lastId++;
            this.name = name;
            this.smells = smells;
            this.date = date;
            isFavorite = false;
            isTriageValid = false;
        }

        public String toString() {
            return "Analysis{ " + smells + + id + " --" + name + " --" + date + " --" + isFavorite +'}';
        }
    }
