package org.ssv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QualityAttributeMS extends QualityAttribute{
    private Relevance relevance;
}
