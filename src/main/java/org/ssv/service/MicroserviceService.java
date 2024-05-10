package org.ssv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.database.jpaRepositories.MicroserviceRepositoryJpa;
import org.ssv.model.Analysis;
import org.ssv.model.Microservice;

import java.util.List;

@Service
public class MicroserviceService {
    @Autowired
    private MicroserviceRepositoryJpa microserviceRepository;

    // Save a microservice
    public Microservice saveMicroservice(Microservice microservice) {
        return microserviceRepository.save(microservice);
    }

    // Find microservices by analysis
    public List<Microservice> findByAnalysis(Analysis analysis) {
        return microserviceRepository.findByAnalysis(analysis);
    }
}

