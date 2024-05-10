package org.ssv.service.util;

import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;

import java.sql.SQLException;
import java.util.List;

public interface ContentParser {
    List<Smell> parseContent(String content, Analysis analysis) throws InvalidContentException, SQLException;
}
