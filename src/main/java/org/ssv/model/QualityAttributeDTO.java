package org.ssv.model;

import lombok.Data;

@Data
public class QualityAttributeDTO {
    private String name;
    private Relevance relevance;
    private QualityAttribute.Category category;
}

