package org.sst.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;

/**
 * Represents a refactoring entity associated with a smell.
 */
@Entity
@Table(name = "refactoring")
@Data
@SuperBuilder
@NoArgsConstructor
public class Refactoring implements Serializable {

    /**
     * The unique identifier for the refactoring.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    /**
     * The name of the refactoring.
     */
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * The description of the refactoring.
     */
    @Column(name = "refactor", nullable = false)
    private String refactor;

    /**
     * The file name found in the associated smell.
     */
    @Column(name = "related_file_name")
    private String relatedFileName;

    /**
     * The list of quality attributes affected by the refactoring.
     */
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "refactoring_quality",
            joinColumns = @JoinColumn(name = "refactoring_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    @JsonDeserialize(contentAs = QualityAttributeSR.class)
    private List<QualityAttribute> propertiesAffected;
}
