package org.sst.service.util;

import org.sst.exception.InvalidContentException;
import org.sst.model.Analysis;
import org.sst.model.Refactoring;
import org.sst.model.Smell;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Abstract class representing a content parser.
 * Provides methods to parse content and extract and assign filenames to smells.
 */
public abstract class ContentParser {

    /**
     * Parses the content which comes from an analysis and returns a list of smells.
     * @param content the content to parse
     * @param analysis the analysis object
     * @return the list of smells
     */
    public abstract List<Smell> parseContent(String content, Analysis analysis);

    /**
     * Assigns the filename to the smell based on the description and the smell code.
     * @param code the smell code
     * @param description the description of the smell
     * @param refactoring the refactoring object
     * @return the refactoring object with the filename assigned
     */
    public Refactoring assignTemplateValues(String code, String description, Refactoring refactoring){
        String fileName = null;
        switch (code){
            case "UPM":
                fileName = extractUPMFileName(description);
                break;
            case "OCC":
                fileName = extractOCCFileName(description);
                break;
            case "MUA":
                fileName = extractMUAFileName(description);
                break;
            case "NSC":
                fileName = extractNSCFileName(description);
                break;
            case "NEDE":
                fileName = extractNEDEFileName(description);
                break;
            case "HS":
                fileName = extractHSFileName(description);
                break;
            case "IAC":
            case "CA":
                fileName = extractIacCaFileName(description);
                break;
            case "PAM":
                fileName = extractPAMFileName(description);
                break;
            case "UT":
                break;
            default:
                throw new InvalidContentException("Invalid smell code: " + code);
        }

        return updateRefactor(refactoring, fileName);
    }

    /**
     * Updates the refactoring object with the filename.
     * @param refactoring the refactoring object
     * @param fileName the filename
     * @return the refactoring object with the filename assigned
     */
    private Refactoring updateRefactor(Refactoring refactoring, String fileName) {
        String refactor = refactoring.getRefactor();
        if (fileName != null) {
            refactor = refactor.replace("file_name", fileName);
        }
        return Refactoring.builder()
            .refactor(refactor)
            .name(refactoring.getName())
            .propertiesAffected(refactoring.getPropertiesAffected())
            .relatedFileName(fileName)
            .build();
    }

    /**
     * Extracts the filename from the description for the UPM smell.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractUPMFileName(String description) {
        Pattern pattern = Pattern.compile("found potential problems in (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Extracts the filename from the description for the HS smell.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractHSFileName(String description) {
        Pattern podPattern = Pattern.compile("Detected secret in pod (\\S+),"); // First pattern: "Detected secret in pod"
        Matcher matcher = podPattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        Pattern filePattern = Pattern.compile("File: (\\S+)"); // Second pattern: "File:"
        matcher = filePattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Extracts the filename from the description for the IAC and CA smells.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractIacCaFileName(String description) {
        Pattern pattern = Pattern.compile("specified in (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Extracts the filename from the description for the NSC smell.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractNSCFileName(String description) {
        Pattern pattern = Pattern.compile("Unencrypted traffic detected in pod (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Extracts the filename from the description for the OCC smell.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractOCCFileName(String description) {
        Pattern pattern = Pattern.compile("Potential usage of custom crypto code in (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        pattern = Pattern.compile("Sonarqube found potential problems in (\\S+)");
        matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Extracts the filename from the description for the MUA smell.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractMUAFileName(String description) {
        Pattern pattern = Pattern.compile("Basic http authorization in (\\S+),");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Extracts the filename from the description for the NEDE smell.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractNEDEFileName(String description) {
        Pattern pattern = Pattern.compile("File: (\\S+):");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    /**
     * Extracts the filename from the description for the PAM smell.
     * @param description the description of the smell
     * @return the filename
     */
    private String extractPAMFileName(String description) {
        Pattern pattern = Pattern.compile("External service detected: (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

}
