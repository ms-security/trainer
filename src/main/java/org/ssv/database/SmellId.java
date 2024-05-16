package org.ssv.database;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.ssv.model.Analysis;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SmellId implements Serializable {
    private int id;
    private String analysisId;
}
