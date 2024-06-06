package org.sst.service;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.sst.model.QualityAttribute;
import org.sst.model.QualityAttributeSR;
import org.sst.model.Refactoring;
import java.io.Serializable;
import java.util.List;

/**
 * SmellDetail class that represents the details associated with a smell code.
 */
@Data
@NoArgsConstructor
public class SmellDetail implements Serializable {

    /**
     * Smell code.
     */
    private String code;

    /**
     * Smell code extended name.
     */
    private String extendedName;

    /**
     * The list of quality attributes affected by the smell.
     */
    @JsonDeserialize(contentAs = QualityAttributeSR.class)
    private List<QualityAttribute> propertiesAffected;

    /**
     * The refactoring that can be applied to the smell.
     */
    private Refactoring refactoring;
}
