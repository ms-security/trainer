package org.sst.service;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.sst.model.*;

/**
 * Service class that calculates the urgency code of a smell based on the relevance of the smell and the microservice.
 */
@Data
@SuperBuilder
@NoArgsConstructor
public class TriageService {

    /**
     * Matrix used to calculate the urgency codes for the smell.
     */
    private static final UrgencyCode[][] URGENCY_MATRIX = {
            {UrgencyCode.Ø, UrgencyCode.LN, UrgencyCode.LL, UrgencyCode.ML},
            {UrgencyCode.LN, UrgencyCode.LL, UrgencyCode.ML, UrgencyCode.MM},
            {UrgencyCode.LL, UrgencyCode.ML, UrgencyCode.MM, UrgencyCode.HM},
            {UrgencyCode.ML, UrgencyCode.MM, UrgencyCode.HM, UrgencyCode.HH}
    };

    /**
     * Calculates the urgency code of a smell based on the relevance of the smell and the microservice.
     * @param microservice the microservice associated with the smell
     * @param smell the smell to calculate the urgency code for
     * @return the urgency code of the smell
     */
    public UrgencyCode urgencyCodeCalculator(Microservice microservice, Smell smell){
        Relevance highestRelevance = Relevance.NONE;
        for (QualityAttribute smellAffectedAttribute : smell.getPropertiesAffected()) {
            for (QualityAttribute microserviceAttribute : microservice.getQualityAttributes()) {
                if (microserviceAttribute instanceof QualityAttributeMS) {
                    QualityAttributeMS castedAttribute = (QualityAttributeMS) microserviceAttribute;
                    if (smellAffectedAttribute.getName().equalsIgnoreCase(castedAttribute.getName()) &&
                            castedAttribute.getRelevance().ordinal() > highestRelevance.ordinal()) {
                        highestRelevance = castedAttribute.getRelevance();
                    }
                }
            }
        }
        return URGENCY_MATRIX[highestRelevance.ordinal()][microservice.getRelevance().ordinal()];
    }

}
