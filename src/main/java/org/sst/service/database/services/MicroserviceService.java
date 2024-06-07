package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.sst.service.database.jparepositories.MicroserviceRepositoryJpa;
import org.sst.model.Microservice;

import java.util.Optional;

/**
 * Service class for Microservice entity.
 * This class is used to interact with the MicroserviceRepositoryJpa.
 * It provides methods to save, find by ID and delete by ID.
 */
@Service
public class MicroserviceService {
    @Autowired
    private MicroserviceRepositoryJpa microserviceRepository;

    /**
     * Save a microservice.
     * @param microservice The microservice to save.
     * @return The saved microservice.
     */
    public Microservice saveMicroservice(Microservice microservice) {
        return microserviceRepository.save(microservice);
    }

    /**
     * Find a microservice by ID.
     * @param microserviceId The ID of the microservice to find.
     * @return The microservice if found, null otherwise.
     */
    public Microservice findMicroserviceById(int microserviceId) {

        Optional<Microservice> microservice = microserviceRepository.findById(microserviceId);
        return microservice.orElse(null);
    }

    /**
     * Delete a microservice by ID.
     * @param microserviceId The ID of the microservice to delete.
     * @return True if the microservice was deleted, false otherwise.
     */
    @Transactional
    public boolean deleteMicroservice(int microserviceId) {
        Optional<Microservice> microserviceOpt = microserviceRepository.findById(microserviceId);
        if (microserviceOpt.isPresent()) {
            microserviceRepository.deleteById(microserviceId);
            return !microserviceRepository.existsById(microserviceId);
        }
        return false;
    }
}

