package org.ssv.service.util;

import org.ssv.exception.InvalidContentException;
import org.ssv.model.Smell;
import org.ssv.service.FactoryAnalysis;
import org.ssv.service.SmellDetail;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TxtContentParser implements ContentParser {

    @Override
    public List<Smell> parseContent(String content) throws Exception {
        if(!Pattern.compile("^Analysis results:\\s*\n").matcher(content).find())
            throw new InvalidContentException("Invalid content");

        content = content.replaceAll("^Analysis results:\\s*\n", "");
        List<Smell> smells = new ArrayList<>();

        Pattern pattern = Pattern.compile("\\{(.*?)\\}\\n(.*?)(?=\\n\\n|\\Z)", Pattern.DOTALL);
        Matcher matcher = pattern.matcher(content);

        int i = 0;
        while (matcher.find()) {
            String code = matcher.group(1).trim();
            SmellDetail detail = FactoryAnalysis.getInstance().findSmellDetailByCode(code);

            if (detail != null) {
                Smell newSmell = Smell.builder()
                        .code(code)
                        .description(matcher.group(2).trim())
                        .id(++i)
                        .extendedName(detail.getExtendedName())
                        .smellTypeDescription(detail.getSmellTypeDescription())
                        .propertiesAffected(detail.getPropertiesAffected())
                        .refactoring(detail.getRefactoring())
                        .build();
                smells.add(newSmell);
            }
            else
                System.out.println("Smell detail not found for code: " + code);
        }
        return smells;
    }

    /*@Override
    public List<Smell> parseContent(String content) throws Exception {
        if(!Pattern.compile("^Analysis results:\\s*\n").matcher(content).find())
            throw new InvalidContentException("Invalid content");

        //conta il numero di \n in content e stampa il numero
        System.out.println("content with \\n: " + content);
        //int count = content.length() - content.replace("\\n", " cane ").length();
        System.out.println("\n\n\n\n");
        content = content.replace('a', 'c');
        System.out.println("Content with cane: " + content);
        //System.out.println("Numero di \\n: " + count);

        content = content.replaceAll("^Analysis results:\\s*\n", "");
        List<Smell> smells = new ArrayList<>();
        String[] smellsToParse = content.split("\n\n");
        System.out.println("Numero di smells: " + smellsToParse.length);

        int j = 0;
        for(int i = 0; i < smellsToParse.length; i++) {
            String firstLine = smellsToParse[i].substring(0, smellsToParse[i].indexOf("\n"));
            System.out.println(" --------- " + firstLine);
            String description = smellsToParse[i].substring(smellsToParse[i].indexOf("\n") + 1);
            String code = firstLine.substring(firstLine.indexOf("{") + 1, firstLine.indexOf("}"));

            SmellDetail detail = FactoryAnalysis.getInstance().findSmellDetailByCode(code);

            if (detail != null) {
                Smell newSmell = Smell.builder()
                        .code(code)
                        .description(description)
                        .fistLineDescription(firstLine)
                        .id(++j)
                        .extendedName(detail.getExtendedName())
                        .smellTypeDescription(detail.getSmellTypeDescription())
                        .propertiesAffected(detail.getPropertiesAffected())
                        .refactoring(detail.getRefactoring())
                        .build();
                smells.add(newSmell);
            }
            else
                System.out.println("Smell detail not found for code: " + code);
        }
        return smells;
    }*/
}
