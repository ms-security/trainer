package org.sst.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.sst.model.*;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class TriageServiceTest {
    private TriageService triageService;
    private Microservice microservice;
    private Smell smell;
    private QualityAttributeMS qualityAttributeMS;
    private QualityAttributeSR qualityAttributeSR;

    @BeforeEach
    void setUp() {
        // Initialize the service
        triageService = new TriageService();

        // Setup Microservice with QualityAttributes
        qualityAttributeMS = new QualityAttributeMS();
        qualityAttributeMS.setName("Security");
        qualityAttributeMS.setRelevance(Relevance.HIGH);

        List<QualityAttribute> microserviceAttributes = new ArrayList<>();
        microserviceAttributes.add(qualityAttributeMS);

        microservice = new Microservice();
        microservice.setName("PaymentService");
        microservice.setRelevance(Relevance.MEDIUM);
        microservice.setQualityAttributes(microserviceAttributes);

        // Setup Smell with affected attributes
        qualityAttributeSR = new QualityAttributeSR();
        qualityAttributeSR.setName("Security");

        List<QualityAttribute> affectedAttributes = new ArrayList<>();
        affectedAttributes.add(qualityAttributeSR);

        smell = Smell.builder().build();
        smell.setPropertiesAffected(affectedAttributes);
    }

    @Test
    void testUrgencyCodeCalculator_HighRelevance() {
        // Expect HIGH urgency due to HIGH relevance impact on a MEDIUM relevance microservice
        qualityAttributeMS.setRelevance(Relevance.HIGH);
        microservice.setRelevance(Relevance.MEDIUM);

        UrgencyCode result = triageService.urgencyCodeCalculator(microservice, smell);
        assertEquals(UrgencyCode.HM, result, "Expected h urgency for HIGH impact and MEDIUM microservice relevance");
    }

    @Test
    void testUrgencyCodeCalculator_MediumRelevance() {
        // Adjust relevance to test medium impact
        qualityAttributeMS.setRelevance(Relevance.MEDIUM);
        microservice.setRelevance(Relevance.LOW);

        UrgencyCode result = triageService.urgencyCodeCalculator(microservice, smell);
        assertEquals(UrgencyCode.ML, result, "Expected m urgency for MEDIUM impact and LOW microservice relevance");
    }

    @Test
    void testUrgencyCodeCalculator_NoRelevance() {
        // Adjust relevance to test no impact
        qualityAttributeMS.setRelevance(Relevance.NONE);
        microservice.setRelevance(Relevance.NONE);

        UrgencyCode result = triageService.urgencyCodeCalculator(microservice, smell);
        assertEquals(UrgencyCode.Ø, result, "Expected no urgency for NONE impact and NONE microservice relevance");
    }
}
