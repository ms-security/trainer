package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import javax.persistence.*;

@Entity
@Table(name = "EffortTime")
@Data
@SuperBuilder
@NoArgsConstructor
public class EffortTime implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "value")
    private int value;

    @Enumerated(EnumType.STRING)
    @Column(name = "unitOfTime")
    private UnitOfTime unitOfTime;

    public enum UnitOfTime {
        MIN, H, D
    }
}
