package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class QualityAttributeSR extends QualityAttribute{
    private boolean impactsPositively;
}
