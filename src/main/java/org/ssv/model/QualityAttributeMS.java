package org.ssv.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue("MS")
@Data
@NoArgsConstructor
public class QualityAttributeMS extends QualityAttribute{
    @Column(name = "relevance")
    private Relevance relevance;
}
