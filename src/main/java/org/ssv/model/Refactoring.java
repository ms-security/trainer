package org.ssv.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;

@Entity
@Table(name = "Refactoring")
@Data
@SuperBuilder
@NoArgsConstructor
public class Refactoring implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "refactor", nullable = false)
    private String refactor;

    @ManyToMany
    @JoinTable(
            name = "refactoring_quality",
            joinColumns = @JoinColumn(name = "refactoring_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    @JsonDeserialize(contentAs = QualityAttributeSR.class)
    private List<QualityAttribute> propertiesAffected;
}
