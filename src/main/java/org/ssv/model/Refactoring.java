package org.ssv.model;

import lombok.Data;

import java.util.List;

@Data
public class Refactoring {
    private String name;
    private String description;
    private List<QualityAttribute> propertiesAffected;
}
