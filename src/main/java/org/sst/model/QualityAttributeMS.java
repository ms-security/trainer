package org.sst.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Represents a Microservice quality attribute entity.
 */
@Entity
@DiscriminatorValue("MS")
@Data
@NoArgsConstructor
public class QualityAttributeMS extends QualityAttribute{

    /**
     * The relevance of the quality attribute.
     */
    @Column(name = "relevance")
    private Relevance relevance;
}
