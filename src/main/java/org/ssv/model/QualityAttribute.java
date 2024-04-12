package org.ssv.model;

import lombok.Data;

@Data
public class QualityAttribute {
    private String name;
    private Relevance relevance;
    private Category category;

    public enum Category {
        SECURITY, PERFORMANCE_EFFICIENCY, MAINTAINABILITY
    }
}
