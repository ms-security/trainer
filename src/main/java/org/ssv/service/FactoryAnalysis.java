package org.ssv.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.exception.FileProcessingException;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;
import org.ssv.service.util.ContentParser;
import org.ssv.service.util.JsonContentParser;
import org.ssv.service.util.TxtContentParser;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

public class FactoryAnalysis {
    private static FactoryAnalysis instance;
    private List<SmellDetail> smellDetails;

    private FactoryAnalysis(){
        loadSmellDetails();
    }

    public static synchronized FactoryAnalysis getInstance() {
        if (instance == null) {
            instance = new FactoryAnalysis();
        }
        return instance;
    }


    public Analysis createAnalysis(MultipartFile file, String name, String dateString, String extension) {
        if (file.isEmpty()) {throw new InvalidContentException("File is empty");}
        String analysisId = UUID.randomUUID().toString();
        LocalDateTime date = extractUploadDate(dateString);
        String content;
        try {
             content= new String(file.getBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new FileProcessingException("Unable to read uploaded file");
        }
        ContentParser parser = null;
        switch (extension) {
            case "txt": parser = new TxtContentParser(); break;
            case "json": parser = new JsonContentParser(); break;
            default: throw new InvalidContentException("Invalid file extension");
        }
        Analysis analysis = Analysis.builder()
                .id(analysisId)
                .name(name)
                .date(date)
                .build();
        List<Smell> smells = parser.parseContent(content, analysis);
        if(smells.isEmpty()) {
            throw new InvalidContentException("Invalid file content");
        }
        analysis.setSmells(smells);
        return analysis;
    }

    private void loadSmellDetails() {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                byte[] data = FileCopyUtils.copyToByteArray(new ClassPathResource("smellDetail.json").getInputStream());
                String json = new String(data, StandardCharsets.UTF_8);
                smellDetails = objectMapper.readValue(json, new TypeReference<List<SmellDetail>>() {});
            } catch (IOException e) {
                System.out.println("Unable to read smell details");
                e.printStackTrace();
                throw new FileProcessingException("Unable to read smell details");
            }

    }

    public SmellDetail findSmellDetailByCode(String code) {
        return smellDetails.stream()
                .filter(detail -> code.equals(detail.getCode()))
                .findFirst()
                .orElse(null); // oppure restituire un valore di default o lanciare un'eccezione
    }

    public LocalDateTime extractUploadDate(String date) {
        Instant instant = Instant.parse(date); //parse the date as an Instant
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault()); //convert the Instant to a LocalDateTime
    }
}
