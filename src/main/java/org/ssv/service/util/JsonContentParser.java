package org.ssv.service.util;

import org.ssv.exception.InvalidContentException;
import org.ssv.model.Smell;
import java.util.List;

public class JsonContentParser implements ContentParser {
    @Override
    public List<Smell> parseContent(String content, String analysisId) throws InvalidContentException {
        return null;
    }
}
