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
}
