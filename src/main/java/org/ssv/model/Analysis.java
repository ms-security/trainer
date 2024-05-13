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
@Table(name = "Analysis")
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

    @JsonProperty("isTriageValid")
    @Column(name = "is_triage_valid")
    private boolean isTriageValid;

    @OneToMany(mappedBy = "analysis",  fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Smell> smells;

    @OneToMany(mappedBy = "analysis",  fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Microservice> microservices;

    public Analysis(String id, String name, LocalDateTime date) {
        this.id = id;
        System.out.println("Costruttore Analysis id: " + id);
        this.name = name;
        this.smells = new ArrayList<>();
        this.date = date;
        this.microservices = new ArrayList<>();
        isFavorite = false;
        isTriageValid = false;
    }

    @Override
    public String toString() {
        return "Analysis{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", date=" + date +
                ", isFavorite=" + isFavorite +
                ", isTriageValid=" + isTriageValid +
                ", smells_count=" + (smells != null ? smells.size() : "null") +
                '}';
    }
}
