package org.ssv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.ssv.service.SmellId;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "smell")
@Data
@SuperBuilder
@NoArgsConstructor
@IdClass(SmellId.class)
public class Smell {
    @Id
    @Column(name = "id", nullable = false)
    private int id;

    @Id
    @Column(name = "analysis_id", nullable = false, insertable = false, updatable = false)
    private String analysisId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "analysis", nullable = false)
    private Analysis analysis;

    @JsonProperty("name")
    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "extended_name")
    private String extendedName;

    @ManyToOne
    @JoinColumn(name = "microservice_id", nullable = true)
    private Microservice microservice;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "effort_time_id")
    private EffortTime effortTime;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "refactoring_id")
    private Refactoring refactoring;

    @Enumerated(EnumType.STRING)
    @Column(name = "urgency_code")
    private UrgencyCode urgencyCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SmellStatus status;

    @Column(name = "is_checked")
    private boolean isChecked;

    @Column(name = "output_Analysis")
    private String outputAnalysis;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "smell_quality",
            joinColumns = {
                    @JoinColumn(name = "smell_id", referencedColumnName = "id"),
                    @JoinColumn(name = "smell_analysis", referencedColumnName = "analysis_id")
            },
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    private List<QualityAttribute> propertiesAffected;

}

