package org.ssv.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Smell {

    private String name;
    private String description;
    private String typeDescription;
    private UrgencyCode urgencyCode;
    private int id;
    private Refactoring refactoring;
    private SmellStatus smellStatus;
    private  boolean isChecked;
    private Microservice microservice;
    //private String extendedName;
    // private String code;
    //private int effortTime;

    public String toString() {
        return "\nSmell-------{" + id + " --" + name + " --" + description +"}-------";
    }
}
