package org.ssv.service.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Refactoring;
import org.ssv.model.Smell;
import org.ssv.model.SmellStatus;
import org.ssv.service.FactoryAnalysis;
import org.ssv.service.SmellDetail;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

public class JsonContentParser extends ContentParser {

    @Override
    public List<Smell> parseContent(String content, Analysis analysis) throws InvalidContentException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> jsonList;

        try {
            jsonList = objectMapper.readValue(content, new TypeReference<>() { });
        } catch (IOException e) {
            throw new InvalidContentException("Invalid JSON content");
        }

        System.out.println("jsonList size " + jsonList.size());

        int i = 0;
        List<Smell> smells = new ArrayList<>();
        for (Map<String, Object> jsonObject : jsonList) {
            String outputAnalysis = (String) jsonObject.get("analysis");
            List<String> smellCodes = (List<String>) jsonObject.get("smells");
            String description = (String) jsonObject.get("description");

            for (String smellCode : smellCodes) {
                System.out.println("smell " + i + "  code " + smellCode);
                if (Objects.equals(smellCode, "OCC")) {
                    System.out.println("OCC smell " + i);
                }

                SmellDetail detail = FactoryAnalysis.getInstance().findSmellDetailByCode(smellCode);

                System.out.println("smell  " + i + "  refactoring description " + detail.getRefactoring().getRefactor());

                Refactoring refactoring = assignTemplateValues(smellCode, description, detail.getRefactoring());

                Smell smell = Smell.builder()
                        //.outputAnalysis(outputAnalysis)
                        .code(smellCode)
                        .description(description)
                        .analysis(analysis)
                        .propertiesAffected(detail.getPropertiesAffected())
                        .refactoring(refactoring)
                        .status(SmellStatus.UNFIXED)
                        .extendedName(detail.getExtendedName())
                        .build();

                System.out.println("smell +++++ " + ++i + "  refactoring description " + smell.getRefactoring().getRefactor());

                smells.add(smell);
            }
        }

        return smells;
    }
}
