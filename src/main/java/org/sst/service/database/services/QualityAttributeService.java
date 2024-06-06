package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.model.Microservice;
import org.sst.service.database.jparepositories.QualityAttributeRepositoryJpa;
import org.sst.model.QualityAttribute;

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
