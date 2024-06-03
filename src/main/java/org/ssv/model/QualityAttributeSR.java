package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;

/**
 * Represents a Smell or Refactoring quality attribute.
 */
@Entity
@DiscriminatorValue("SR")
@Data
@NoArgsConstructor
public class QualityAttributeSR extends QualityAttribute {

    /**
     * The impact of the quality attribute.
     */
    @Column(name = "impactsPositively")
    private boolean impactsPositively;
}
