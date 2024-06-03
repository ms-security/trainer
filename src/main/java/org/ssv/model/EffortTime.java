package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import javax.persistence.*;

/**
 * Represents an effort time entity associated with a smell.
 */
@Entity
@Table(name = "effort_time")
@Data
@SuperBuilder
@NoArgsConstructor
public class EffortTime implements Serializable {

    /**
     * The unique identifier for the effort time.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    /**
     * The value of the effort time.
     */
    @Column(name = "value")
    private int value;

    /**
     * The unit of time of the effort time.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "unitOfTime")
    private UnitOfTime unitOfTime;

    /**
     * The enum for the unit of time.
     */
    public enum UnitOfTime {
        MIN, H, D
    }
}
