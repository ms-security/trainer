package org.ssv.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.persistence.*;

@Entity
@Table(name = "analysis")
@Data
@SuperBuilder
@NoArgsConstructor
public class Analysis {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "date")
    private LocalDateTime date;

    @JsonProperty("isFavorite")
    @Column(name = "is_favorite")
    private boolean isFavorite;

    @OneToMany(mappedBy = "analysisId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Smell> smells;

    @OneToMany(mappedBy = "analysis", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Microservice> microservices;
}
