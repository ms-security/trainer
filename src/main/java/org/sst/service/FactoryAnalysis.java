package org.sst.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.sst.exception.FileProcessingException;
import org.sst.exception.InvalidContentException;
import org.sst.model.Analysis;
import org.sst.model.Smell;
import org.sst.service.util.ContentParser;
import org.sst.service.util.JsonContentParser;
import org.sst.service.util.TxtContentParser;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

/**
 * Factory class that creates Analysis objects from uploaded files.
 * It uses a ContentParser to parse the content of the file and create a list of Smell objects.
 * It also loads the details of the smells from a JSON file.
 */
public class FactoryAnalysis {

    /**
     * Singleton instance of the FactoryAnalysis class.
     */
    private static FactoryAnalysis instance;

    /**
     * List of SmellDetail objects that contain the details of the smells.
     */
    private List<SmellDetail> smellDetails;

    /**
     * Private constructor that loads the smell details from a JSON file.
     */
    private FactoryAnalysis(){
        loadSmellDetails();
    }

    /**
     * Returns the singleton instance of the FactoryAnalysis class.
     * @return the singleton instance of the FactoryAnalysis class
     */
    public static synchronized FactoryAnalysis getInstance() {
        if (instance == null) {
            instance = new FactoryAnalysis();
        }
        return instance;
    }

    /**
     * Creates an Analysis object from an uploaded file.
     * @param file the uploaded file
     * @param name the name of the analysis
     * @param dateString the date of the analysis
     * @param extension the extension of the file
     * @throws InvalidContentException if the file is empty, the content is invalid or the extension is invalid
     * @throws FileProcessingException if the file cannot be read
     * @return the Analysis object created from the uploaded file
     */
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

    /**
     * Loads the smell details from a JSON file.
     */
    private void loadSmellDetails() {
            ObjectMapper objectMapper = new ObjectMapper();
            try {
                byte[] data = FileCopyUtils.copyToByteArray(new ClassPathResource("smellDetail.json").getInputStream());
                String json = new String(data, StandardCharsets.UTF_8);
                smellDetails = objectMapper.readValue(json, new TypeReference<List<SmellDetail>>() {});
            } catch (IOException e) {
                throw new FileProcessingException("Unable to read smell details");
            }

    }

    /**
     * Returns the SmellDetail object with the specified code.
     * @param code the code of the Smell
     * @return the SmellDetail object with the specified code
     */
    public SmellDetail findSmellDetailByCode(String code) {
        return smellDetails.stream()
                .filter(detail -> code.equals(detail.getCode()))
                .findFirst()
                .orElse(null); // oppure restituire un valore di default o lanciare un'eccezione
    }

    /**
     * Extracts the upload date from a string.
     * @param date the string containing the date
     * @return the LocalDateTime object representing the date
     */
    public LocalDateTime extractUploadDate(String date) {
        Instant instant = Instant.parse(date); //parse the date as an Instant
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault()); //convert the Instant to a LocalDateTime
    }
}
