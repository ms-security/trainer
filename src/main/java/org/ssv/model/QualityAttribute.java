package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Represents a quality attribute entity.
 */
@Entity
@Table(name = "quality_attribute")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
@Data
@NoArgsConstructor
public abstract class QualityAttribute implements Serializable {

    /**
     * The unique identifier for the quality attribute.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    /**
     * The name of the quality attribute.
     */
    @Column(name = "name")
    private String name;

    /**
     * The category of the quality attribute.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private Category category;

    /**
     * The enum representing the category of the quality attribute.
     */
    public enum Category {
        SECURITY, PERFORMANCE_EFFICIENCY, MAINTAINABILITY
    }
}
