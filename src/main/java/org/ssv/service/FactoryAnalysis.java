package org.ssv.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;
import org.ssv.service.util.ContentParser;
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

    private FactoryAnalysis(){
        loadSmellDetails();
    };

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
            System.out.println("Errore nella lettura del file smellDetail.json ");
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


    public Analysis createAnalysis(ContentParser parser, String fileContent, String name, String dateString) throws Exception {
        List<Smell> smells = parser.parseContent(fileContent);
        LocalDateTime date = extractUploadDate(dateString);
        return new Analysis(name, smells, date);
    }

    public LocalDateTime extractUploadDate(String date) {
        Instant instant = Instant.parse(date); //parse the date as an Instant
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault()); //convert the Instant to a LocalDateTime
    }
}
