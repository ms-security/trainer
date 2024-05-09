package org.ssv.model;

import lombok.Data;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "Microservice")
@Data
public class Microservice {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    private Analysis analysis;

    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "relevance", nullable = false)
    private Relevance relevance;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "microservice_quality",
            joinColumns = @JoinColumn(name = "microservice_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    private List<QualityAttribute> qualityAttributes;
}
