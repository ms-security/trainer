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

    public List<Smell> parseContent(String content) throws Exception {

        if(!Pattern.compile("^Analysis results:\\s*\n").matcher(content).find())
            throw new InvalidContentException("Invalid content"); //throws an exception if the content does not start with "Analysis results:"
        content = content.replaceAll("^Analysis results:\\s*\n", ""); //removes the first line
        List<Smell> smells = new ArrayList<>();
        String[] smellsToParse = content.split("\\n\\n"); //split the analysis into smells

        int i = 0;
        for (String smell : smellsToParse){
            String name = smell.substring(smell.indexOf("{") + 1, smell.indexOf("}")); //extracts the name of the smell
            String description = smell.substring(smell.indexOf('\t') + 1); //extracts the description of the smell
            Smell newSmell = Smell.builder().name(name).description(description).id(++i).build();
            smells.add(newSmell);
        }
        return smells;
    }

    public LocalDateTime extractUploadDate(String date) throws JsonProcessingException {
        Instant instant = Instant.parse(date); //parse the date as an Instant
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault()); //convert the Instant to a LocalDateTime
    }
}
