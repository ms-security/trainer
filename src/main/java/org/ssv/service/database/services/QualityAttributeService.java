package org.ssv.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.model.Microservice;
import org.ssv.service.database.jpaRepositories.QualityAttributeRepositoryJpa;
import org.ssv.model.QualityAttribute;

import java.util.List;

@Service
public class QualityAttributeService {
    @Autowired
    private QualityAttributeRepositoryJpa qualityAttributeRepository;

    public void saveQualityAttributes(List<QualityAttribute> qualityAttributes) {
        qualityAttributeRepository.saveAll(qualityAttributes);
    }

    public void deleteQualityAttributeByMicroservice(Microservice microservice) {
        qualityAttributeRepository.deleteAll(microservice.getQualityAttributes());
    }
}
