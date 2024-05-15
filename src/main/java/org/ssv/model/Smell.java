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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column(name = "extended_name")
    private String extendedName;

    @ManyToOne
    @JoinColumn(name = "microservice_id", nullable = true)
    private Microservice microservice;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "effort_time_id")
    private EffortTime effortTime;

    @ManyToOne(cascade = CascadeType.REMOVE)
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

    @ManyToMany(cascade = CascadeType.REMOVE)
    @JoinTable(
            name = "smell_quality",
            joinColumns = @JoinColumn(name = "smell_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    private List<QualityAttribute> propertiesAffected;

    public String toString() {
        return "Smell{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", analysis_id=" + (analysis != null ? analysis.getId() : "null") +
                '}';
    }
}