package org.sst.service.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.sst.exception.FileProcessingException;
import org.sst.exception.InvalidContentException;
import org.sst.model.Analysis;
import org.sst.model.Refactoring;
import org.sst.model.Smell;
import org.sst.model.SmellStatus;
import org.sst.service.FactoryAnalysis;
import org.sst.service.SmellDetail;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class JsonContentParser extends ContentParser {

    @Override
    public List<Smell> parseContent(String content, Analysis analysis) {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> jsonList;
        try {
            jsonList = objectMapper.readValue(content, new TypeReference<>() { });
        } catch (IOException e) {
            throw new FileProcessingException("Unable to parse JSON content");
        }
        int i = 0;
        List<Smell> smells = new ArrayList<>();
        for (Map<String, Object> jsonObject : jsonList) {
            String outputAnalysis = (String) jsonObject.get("analysis");
            List<String> smellCodes = (List<String>) jsonObject.get("smells");
            String description = (String) jsonObject.get("description");

            for (String smellCode : smellCodes) {
                SmellDetail detail = FactoryAnalysis.getInstance().findSmellDetailByCode(smellCode);
                if (detail == null) {
                    throw new InvalidContentException("Unsupported smell code: " + smellCode);
                }
                Refactoring refactoring = assignTemplateValues(smellCode, description, detail.getRefactoring());

                Smell smell = Smell.builder()
                        .outputAnalysis(outputAnalysis)
                        .id(++i)
                        .code(smellCode)
                        .description(description)
                        .analysis(analysis)
                        .analysisId(analysis.getId())
                        .propertiesAffected(detail.getPropertiesAffected())
                        .refactoring(refactoring)
                        .status(SmellStatus.NOT_FIXED)
                        .extendedName(detail.getExtendedName())
                        .build();

                smells.add(smell);
            }
        }

        return smells;
    }
}
