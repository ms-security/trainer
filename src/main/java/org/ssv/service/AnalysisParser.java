package org.ssv.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import lombok.Data;
import org.ssv.exception.EmptyContentException;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Smell;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;


@Data
@Builder
public class AnalysisParser {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private String jsonContent;

    public List<Smell> parseContent(String jsonContent) throws Exception {

        jsonContent = extractContent(jsonContent); //extracts the analysis from the json
        List<Smell> smells = new ArrayList<>();
        String[] smellsToParse = jsonContent.split("\\n\\n"); //split the analysis into smells

        for (String smell : smellsToParse){
            String name = smell.substring(smell.indexOf("{") + 1, smell.indexOf("}")); //extracts the name of the smell
            String description = smell.substring(smell.indexOf('\t') + 1); //extracts the description of the smell
            Smell newSmell = Smell.builder().name(name).description(description).build();
            smells.add(newSmell);
        }
        return smells;
    }

    public static String extractContent(String jsonInput) throws EmptyContentException, InvalidContentException, JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonInput); //extracts the root node of the json
        JsonNode contentNode = rootNode.path("content"); //extracts the content node of the json
        String content = contentNode.asText(); //converts the content a string

        if(content.isEmpty())
            throw new EmptyContentException("Empty content"); //throws an exception if the content is empty

        if(!Pattern.compile("^Analysis results:\\s*\n").matcher(content).find())
            throw new InvalidContentException("Invalid content"); //throws an exception if the content does not start with "Analysis results:"

        content = content.replaceAll("^Analysis results:\\s*\n", ""); //removes the first line
        return content;
    }

    public String extractName(String jsonInput) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonInput); //extracts the root node of the json
        JsonNode nameNode = rootNode.path("name"); //extracts the name node of the json
        return nameNode.asText(); //converts the name a string
    }

    public LocalDateTime extractUploadDate(String jsonInput) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonInput); //extracts the root node of the json
        JsonNode uploadDateNode = rootNode.path("date"); //extracts the uploadDate node of the json
        Instant instant = Instant.parse(uploadDateNode.asText()); //parse the date as an Instant
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault()); //convert the Instant to a LocalDateTime
    }
}
