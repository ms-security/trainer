package org.ssv.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Smell {

    private String smellName;

    public String toString() {
        return "Smell-------{" + smellName +"}-------";
    }
}
