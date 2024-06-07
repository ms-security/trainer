package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.model.Microservice;
import org.sst.service.database.jparepositories.QualityAttributeRepositoryJpa;
import org.sst.model.QualityAttribute;

import java.util.List;

/**
 * Service class for QualityAttribute entity.
 * This class is used to interact with the QualityAttributeRepositoryJpa.
 */
@Service
public class QualityAttributeService {
    @Autowired
    private QualityAttributeRepositoryJpa qualityAttributeRepository;

    /**
     * Save a list of QualityAttribute objects.
     * @param qualityAttributes List of QualityAttribute objects to be saved.
     */
    public void saveQualityAttributes(List<QualityAttribute> qualityAttributes) {
        qualityAttributeRepository.saveAll(qualityAttributes);
    }

    /**
     * Delete a list of QualityAttribute objects of a Microservice.
     * @param microservice Microservice with list of QualityAttribute objects to be deleted.
     */
    public void deleteQualityAttributeByMicroservice(Microservice microservice) {
        qualityAttributeRepository.deleteAll(microservice.getQualityAttributes());
    }
}
