package org.ssv.model;

import lombok.Data;

import java.util.List;
@Data
public class MicroserviceDTO {
    private String name;
    private Relevance relevance;
    private List<QualityAttribute> qualityAttributes;
}