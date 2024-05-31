package org.ssv.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.*;

/**
 * Represents an analysis entity.
 */
@Entity
@Table(name = "analysis")
@Data
@SuperBuilder
@NoArgsConstructor
public class Analysis {

    /**
     * The unique identifier for the analysis.
     */
    @Id
    @Column(name = "id")
    private String id;

    /**
     * The name of the analysis.
     */
    @Column(name = "name")
    private String name;

    /**
     * The date when the analysis was uploaded.
     */
    @Column(name = "date")
    private LocalDateTime date;

    /**
     * Indicates whether the analysis is marked as a favorite.
     */
    @JsonProperty("isFavorite")
    @Column(name = "is_favorite")
    private boolean isFavorite;

    /**
     * The list of smells associated with this analysis.
     * These are mapped by the 'analysisId' field in the Smell entity.
     */
    @OneToMany(mappedBy = "analysisId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Smell> smells;

    /**
     * The list of microservices associated with this analysis.
     * These are mapped by the 'analysis' field in the Microservice entity.
     */
    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Microservice> microservices;
}
