package org.ssv.service;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ssv.model.QualityAttribute;
import org.ssv.model.QualityAttributeSR;
import org.ssv.model.Refactoring;
import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
public class SmellDetail implements Serializable {
    private String code;
    private String extendedName;
    @JsonDeserialize(contentAs = QualityAttributeSR.class)
    private List<QualityAttribute> propertiesAffected;
    private Refactoring refactoring;
}
