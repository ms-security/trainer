package org.ssv.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
public class Refactoring implements Serializable {
    private String name;
    private String refactor;
    @JsonDeserialize(contentAs = QualityAttributeSR.class)
    private List<QualityAttribute> propertiesAffected;
}
