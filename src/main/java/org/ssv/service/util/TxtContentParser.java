package org.ssv.service.util;

import org.ssv.exception.InvalidContentException;
import org.ssv.model.Smell;

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
            String codes = matcher.group(1).trim();  // Capture all codes within the braces
            String description = matcher.group(2).trim();  // Capture the description following the code

            Smell newSmell = Smell.builder()
                    .name(codes)  // Use the entire code string as the name
                    .description(description)
                    .id(++i)
                    .build();
            smells.add(newSmell);
        }
        System.out.println(smells);
        return smells;
    }
}
