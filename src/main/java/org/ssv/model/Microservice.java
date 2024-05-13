package org.ssv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "Microservice")
@Data
public class Microservice {

    @JsonIgnore
    @ManyToOne
    private Analysis analysis;

    @Id
    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "relevance", nullable = false)
    private Relevance relevance;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.REMOVE, CascadeType.MERGE})
    @JoinTable(
            name = "microservice_quality",
            joinColumns = @JoinColumn(name = "microservice_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    private List<QualityAttribute> qualityAttributes;
}
