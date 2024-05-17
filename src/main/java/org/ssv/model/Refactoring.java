package org.ssv.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.util.List;
import javax.persistence.*;

@Entity
@Table(name = "refactoring")
@Data
@SuperBuilder
@NoArgsConstructor
public class Refactoring implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private int id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "refactor", nullable = false)
    private String refactor;

    @Column(name = "related_file_name")
    private String relatedFileName;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "refactoring_quality",
            joinColumns = @JoinColumn(name = "refactoring_id"),
            inverseJoinColumns = @JoinColumn(name = "quality_attribute_id")
    )
    @JsonDeserialize(contentAs = QualityAttributeSR.class)
    private List<QualityAttribute> propertiesAffected;
}
