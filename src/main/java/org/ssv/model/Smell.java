package org.ssv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "Smell")
@Data
@SuperBuilder
@NoArgsConstructor
public class Smell {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "analysis_id", nullable = false)
    private Analysis analysis;

    @JsonProperty("name")
    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "extendedName")
    private String extendedName;

    @Column(name = "smellTypeDescription")
    private String smellTypeDescription;

    @ManyToOne
    @JoinColumn(name = "microservice_id")
    private Microservice microservice;

    @ManyToOne
    @JoinColumn(name = "effortTime_id")
    private EffortTime effortTime;

    @ManyToOne
    @JoinColumn(name = "refactoring_id")
    private Refactoring refactoring;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgencyCode")
    private UrgencyCode urgencyCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SmellStatus status;

    @Column(name = "isChecked")
    private boolean isChecked;

    @ManyToMany
    @JoinTable(
            name = "smell_quality",
            joinColumns = @JoinColumn(name = "smell_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    private List<QualityAttribute> propertiesAffected;
}