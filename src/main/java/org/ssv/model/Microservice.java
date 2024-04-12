package org.ssv.model;

import lombok.Data;

import java.util.List;

@Data
public class Microservice {
    private String name;
    private Relevance relevance;
    private List<QualityAttribute> qualityAttributes;
}
