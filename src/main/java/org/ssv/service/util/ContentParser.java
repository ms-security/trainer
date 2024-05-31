package org.ssv.service.util;

import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Refactoring;
import org.ssv.model.Smell;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public abstract class ContentParser {

    public abstract List<Smell> parseContent(String content, Analysis analysis);

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

    private String extractUPMFileName(String description) {
        Pattern pattern = Pattern.compile("found potential problems in (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

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


    private String extractIacCaFileName(String description) {
        Pattern pattern = Pattern.compile("specified in (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private String extractNSCFileName(String description) {
        Pattern pattern = Pattern.compile("Unencrypted traffic detected in pod (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

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

    private String extractMUAFileName(String description) {
        Pattern pattern = Pattern.compile("Basic http authorization in (\\S+),");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private String extractNEDEFileName(String description) {
        Pattern pattern = Pattern.compile("File: (\\S+):");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private String extractPAMFileName(String description) {
        System.out.println(description);
        Pattern pattern = Pattern.compile("External service detected: (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            System.out.println(matcher.group(1));
            return matcher.group(1);
        }
        return null;
    }

}
