package org.ssv.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
public class Analysis {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private List<Smell> smell;
    private int id;

    public Analysis(String analysis) throws Exception {
        id = 1;
        smell = new java.util.ArrayList<Smell>();
        List<String> smellS = parseContent(analysis);
        for (String s : smellS) {
            Smell smellObj = Smell.builder().smellName(s).build();
            smell.add(smellObj);
        }
    }

    public static List<String> parseContent(String jsonContent) throws Exception {
        jsonContent = extractContent(jsonContent);

        String[] parts = jsonContent.split("\\n\\n");

        for (int i = 0; i < parts.length; i++) {
            parts[i] = parts[i].trim();
        }

        return List.of(parts);
    }

    public static String extractContent(String jsonInput) throws Exception {
        JsonNode rootNode = objectMapper.readTree(jsonInput);
        JsonNode contentNode = rootNode.path("content");
        return contentNode.asText();
    }

    public String toString() {
        return "Analysis{ " + smell + '}';
    }

}
