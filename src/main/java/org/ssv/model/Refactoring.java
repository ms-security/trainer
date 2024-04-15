package org.ssv.model;

import lombok.Data;

import java.util.List;

@Data
public class Refactoring {
    private String code;
    private String name;
    private String description;
    private List<String> propertiesAffected;
    private String proposedRefactor;


}
