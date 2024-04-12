package org.ssv.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Smell {

    private String name;
    private String description;
    private int id;
    private Refactoring refactoring;

    public String toString() {
        return "\nSmell-------{" + id + " --" + name + " --" + description +"}-------";
    }
}
