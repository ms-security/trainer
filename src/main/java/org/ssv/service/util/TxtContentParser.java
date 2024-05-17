package org.ssv.service.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.exception.InvalidContentException;
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
    private static final Logger LOGGER = LoggerFactory.getLogger(TxtContentParser.class);

    @Override
    public List<Smell> parseContent(String content, Analysis analysis) throws InvalidContentException{
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
            String description = matcher.group(2).trim();
            Refactoring refactoring = assignTemplateValues(code, description, detail.getRefactoring());
            System.out.println(code + " " + ++i);

            Smell newSmell = Smell.builder()
                    .code(code)
                    .id(++i)
                    .description(description)
                    .extendedName(detail.getExtendedName())
                    .propertiesAffected(detail.getPropertiesAffected())
                    .refactoring(refactoring)
                    .status(SmellStatus.UNFIXED)
                    .analysis(analysis)
                    .analysisId(analysis.getId())
                    .build();
            smells.add(newSmell);
        }
        return smells;
    }
}
