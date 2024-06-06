package org.sst.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import javax.persistence.*;
import java.util.List;

/**
 * Represents a microservice entity associated with an analysis.
 */
@Entity
@Table(name = "microservice")
@Data
@SuperBuilder
@NoArgsConstructor
public class Microservice {

    /**
     * The unique identifier for the microservice.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    /**
     * The analysis associated with this microservice.
     */
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "analysis_id", nullable = false)
    private Analysis analysis;

    /**
     * The name of the microservice.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * The relevance of the microservice.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "relevance", nullable = false)
    private Relevance relevance;

    /**
     * The list of quality attributes associated with this microservice.
     */
    @ManyToMany
    @JoinTable(
            name = "microservice_quality",
            joinColumns = @JoinColumn(name = "microservice_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    @JsonDeserialize(contentAs = QualityAttributeMS.class)
    private List<QualityAttribute> qualityAttributes;
}
