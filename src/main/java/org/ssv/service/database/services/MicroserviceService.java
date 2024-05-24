package org.ssv.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssv.service.database.jpaRepositories.MicroserviceRepositoryJpa;
import org.ssv.model.Analysis;
import org.ssv.model.Microservice;

import java.util.List;
import java.util.Optional;

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

    // Find microservice by ID
    public Microservice findMicroserviceById(String analysisId, int microserviceId) {

        Optional<Microservice> microservice = microserviceRepository.findById(microserviceId);
        return microservice.orElse(null);
    }

    @Transactional
    public boolean deleteMicroservice(int microserviceId) {
        Optional<Microservice> microserviceOpt = microserviceRepository.findById(microserviceId);
        if (microserviceOpt.isPresent()) {
            Microservice microservice = microserviceOpt.get();
            microserviceRepository.deleteById(microserviceId);
            return !microserviceRepository.existsById(microserviceId);
        }
        return false;
    }
}

