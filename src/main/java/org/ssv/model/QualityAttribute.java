package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
public abstract class QualityAttribute implements Serializable {
    private String name;
    private Category category;

    public enum Category {
        SECURITY, PERFORMANCE_EFFICIENCY, MAINTAINABILITY
    }
}
