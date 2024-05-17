package org.ssv.service.util;

import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Refactoring;
import org.ssv.model.Smell;

import java.sql.SQLException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public abstract class ContentParser {
    //private String fileName;

    abstract public List<Smell> parseContent(String content, Analysis analysis) throws InvalidContentException, SQLException;

    public Refactoring assignTemplateValues(String code, String description, Refactoring refactoring){
        String fileName = null;
        switch (code){
            case "UPM":
                fileName = extractUPMFileName(description);
                break;
            case "OCC":
                fileName = extractOCCFileName(description);
                break;
            case "PAM":
                break;
            case "MUA":
                break;
            case "NSC":
                fileName = extractNSCFileName(description);
                break;
            case "NEDE":
                break;
            case "IAC":
            case "CA":
                fileName = extractIacCaFileName(description);
                break;
            case "UT":
                break;
            case "HS":
                fileName = extractHSFileName(description);
                break;
            default:
                System.out.println("Invalid smell code: " + code);
                //throw new IllegalArgumentException("Invalid smell code: " + code);
        }

        return updateRefactor(refactoring, fileName);
    }

    private Refactoring updateRefactor(Refactoring refactoring, String fileName) {
        if (fileName != null) {
            String refactor = refactoring.getRefactor();
            refactor = refactor.replace("template", fileName);

            return Refactoring.builder()
                    .refactor(refactor)
                    .name(refactoring.getName())
                    .propertiesAffected(refactoring.getPropertiesAffected())
                    .relatedFileName(fileName)
                    .build();
        }
        return null;
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
        System.out.println("description: " + description);
        Pattern podPattern = Pattern.compile("Detected secret in pod (\\S+),"); // First pattern: "Detected secret in pod"
        Matcher matcher = podPattern.matcher(description);
        if (matcher.find()) {
            System.out.println("Matched pod pattern");
            return matcher.group(1);
        }
        Pattern filePattern = Pattern.compile("File: (\\S+)"); // Second pattern: "File:"
        matcher = filePattern.matcher(description);
        if (matcher.find()) {
            System.out.println("Matched file pattern");
            return matcher.group(1);
        }

        System.out.println("No pattern matched");
        return null;
    }


    private String extractIacCaFileName(String description) {
        Pattern pattern = Pattern.compile("specified in (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            System.out.println("fileName: " + matcher.group(1));
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
        System.out.println("OCC - description: " + description);
        Pattern pattern = Pattern.compile("Potential usage of custom crypto code in (\\S+)");
        Matcher matcher = pattern.matcher(description);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

}
