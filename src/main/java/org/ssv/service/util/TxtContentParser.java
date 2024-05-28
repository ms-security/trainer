package org.ssv.service.util;

import org.ssv.model.Analysis;
import org.ssv.model.Refactoring;
import org.ssv.model.Smell;
import org.ssv.model.SmellStatus;
import org.ssv.service.FactoryAnalysis;
import org.ssv.service.SmellDetail;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TxtContentParser extends ContentParser {

    @Override
    public List<Smell> parseContent(String content, Analysis analysis) {

        content = content.replace("\r\n", "\n").replace("\r", "\n");

        content = content.replace("^Analysis results:\\s*\n", "");
        List<Smell> smells = new ArrayList<>();

        Pattern pattern = Pattern.compile("^(.*?) - detected smells \\{(.*?)\\}\\n([\\s\\S]*?)(?=\\n\\w|\\Z)", Pattern.MULTILINE);
        Matcher matcher = pattern.matcher(content);

        int i = 0;
        while (matcher.find()) {
            String analysisValue = matcher.group(1).trim();
            String codes = matcher.group(2).trim();
            String description = matcher.group(3).trim();


            for (String code : codes.split(",")) {
                code = code.trim();
                SmellDetail detail = FactoryAnalysis.getInstance().findSmellDetailByCode(code);
                Refactoring refactoring = assignTemplateValues(code, description, detail.getRefactoring());

                Smell newSmell = Smell.builder()
                        .code(code)
                        .id(++i)
                        .description(description)
                        .extendedName(detail.getExtendedName())
                        .propertiesAffected(detail.getPropertiesAffected())
                        .refactoring(refactoring)
                        .status(SmellStatus.NOT_FIXED)
                        .analysis(analysis)
                        .analysisId(analysis.getId())
                        .outputAnalysis(analysisValue)
                        .build();
                smells.add(newSmell);
            }
        }
        return smells;
    }
}
