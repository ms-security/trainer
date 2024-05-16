package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;

@Entity
@DiscriminatorValue("SR")
@Data
@NoArgsConstructor
public class QualityAttributeSR extends QualityAttribute {
    @Column(name = "impactsPositively")
    private boolean impactsPositively;
}
