package org.ssv.service.util;

import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;
import java.util.List;

public class JsonContentParser implements ContentParser {
    @Override
    public List<Smell> parseContent(String content, Analysis analysis) throws InvalidContentException {
        return null;
    }
}
