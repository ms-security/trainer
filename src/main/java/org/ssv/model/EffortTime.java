package org.ssv.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;

@Data
@SuperBuilder
@NoArgsConstructor
public class EffortTime implements Serializable {

    private int value;
    private UnitOfTime unitOfTime;

    public enum UnitOfTime {
        MIN, H, D
    }
}
