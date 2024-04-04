package org.ssv.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Data
public class Analysis {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private List<Smell> smells;
    private int id;


    public Analysis(String analysis) throws Exception {
        id = 1;
        smells = new ArrayList<>();
        parseContent(analysis); // Modificato per aggiornare direttamente la lista degli smells
    }

    private void parseContent(String jsonContent) throws Exception {
        jsonContent = extractContent(jsonContent);
        // Crea un pattern che identifica le righe con {}
        Pattern pattern = Pattern.compile(".*\\{.+\\}.*");
        String[] lines = jsonContent.split("\n");
        jsonContent = jsonContent.replaceAll("^Analysis results:\\s*\n", "");
        String currentName = null;
        StringBuilder descriptionBuilder = new StringBuilder();

        for (String line : lines) {
            if (pattern.matcher(line).find()) {
                // Quando trova una nuova linea smell, aggiunge il precedente (se esiste) alla lista
                if (currentName != null) {
                    smells.add(new Smell(currentName, descriptionBuilder.toString().trim()));
                    descriptionBuilder = new StringBuilder();
                }
                // Estrae il nome dello smell dalle parentesi graffe
                currentName = line.substring(line.indexOf("{") + 1, line.indexOf("}"));
            } else {
                if (descriptionBuilder.length() > 0) descriptionBuilder.append("\n");
                descriptionBuilder.append(line.trim());
            }
        }

        // Aggiunge l'ultimo smell rilevato alla lista
        if (currentName != null && descriptionBuilder.length() > 0) {
            smells.add(new Smell(currentName, descriptionBuilder.toString().trim()));
        }
    }

    public static String extractContent(String jsonInput) throws Exception {
        JsonNode rootNode = objectMapper.readTree(jsonInput);
        JsonNode contentNode = rootNode.path("content");
        return contentNode.asText();
    }

    public String toString() {
        return "Analysis{ " + smells + '}';
    }

}
