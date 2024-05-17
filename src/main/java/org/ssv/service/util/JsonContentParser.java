package org.ssv.service.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;
import org.ssv.model.SmellStatus;
import org.ssv.service.FactoryAnalysis;
import org.ssv.service.SmellDetail;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class JsonContentParser implements ContentParser {

    @Override
    public List<Smell> parseContent(String content, Analysis analysis) throws InvalidContentException {
        ObjectMapper objectMapper = new ObjectMapper();
        List<Map<String, Object>> jsonList;

        try {
            jsonList = objectMapper.readValue(content, new TypeReference<List<Map<String, Object>>>() {});
        } catch (IOException e) {
            throw new InvalidContentException("Invalid JSON content");
        }
        int i = 0;
        List<Smell> smells = new ArrayList<>();
        for (Map<String, Object> jsonObject : jsonList) {
            String outputAnalysis = (String) jsonObject.get("analysis");
            List<String> smellCodes = (List<String>) jsonObject.get("smells");
            String description = (String) jsonObject.get("description");
            for (String smellCode : smellCodes) {
                SmellDetail detail = FactoryAnalysis.getInstance().findSmellDetailByCode(smellCode);
                Smell smell = Smell.builder()
                        .outputAnalysis(outputAnalysis)
                        .id(++i)
                        .code(smellCode)
                        .description(description)
                        .analysis(analysis)
                        .analysisId(analysis.getId())
                        .propertiesAffected(detail.getPropertiesAffected())
                        .refactoring(detail.getRefactoring())
                        .status(SmellStatus.UNFIXED)
                        .extendedName(detail.getExtendedName())
                        .build();
                smells.add(smell);
            }
        }

        return smells;
    }
}
