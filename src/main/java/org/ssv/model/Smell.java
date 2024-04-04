package org.ssv.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Smell {

    private String name;
    private String description;

    public String toString() {
        return "\nSmell-------{" + name + " --" + description +"}-------";
    }
}
