package org.sst.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Represents the composed primary key of smells entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmellId implements Serializable {

    /**
     * The unique identifier for the smell.
     */
    private int id;

    /**
     * The unique identifier for the analysis associated with the smell.
     */
    private String analysisId;
}
