package org.ssv.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;
import org.ssv.service.util.ContentParser;
import org.ssv.service.util.TxtContentParser;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

public class FactoryAnalysis {
    private static FactoryAnalysis instance;
    private ContentParser parser;  // Strategy interface
    private List<SmellDetail> smellDetails;
    private static final Logger LOGGER = LoggerFactory.getLogger(FactoryAnalysis.class);

    private FactoryAnalysis(){
        loadSmellDetails();
    }

    public static synchronized FactoryAnalysis getInstance() {
        if (instance == null) {
            instance = new FactoryAnalysis();
        }
        return instance;
    }

    private void loadSmellDetails() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            byte[] data = FileCopyUtils.copyToByteArray(new ClassPathResource("smellDetail.json").getInputStream());
            String json = new String(data, StandardCharsets.UTF_8);
            smellDetails = objectMapper.readValue(json, new TypeReference<List<SmellDetail>>() {});
        } catch (Exception e) {
            LOGGER.error("Errore nella lettura del file smellDetail.json ");
            e.printStackTrace();
            smellDetails = new ArrayList<>();
        }
    }

    public SmellDetail findSmellDetailByCode(String code) {
        return smellDetails.stream()
                .filter(detail -> code.equals(detail.getCode()))
                .findFirst()
                .orElse(null); // oppure restituire un valore di default o lanciare un'eccezione
    }


    public Analysis createAnalysis(ContentParser parser, String fileContent, String name, String dateString) throws InvalidContentException {
        List<Smell> smells = parser.parseContent(fileContent);
        LocalDateTime date = extractUploadDate(dateString);
        return new Analysis(name, smells, date);
    }

    public LocalDateTime extractUploadDate(String date) {
        Instant instant = Instant.parse(date); //parse the date as an Instant
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault()); //convert the Instant to a LocalDateTime
    }
}
