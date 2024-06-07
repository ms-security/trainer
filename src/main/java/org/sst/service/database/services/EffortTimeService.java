package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.service.database.jparepositories.EffortTimeRepositoryJpa;
import org.sst.model.EffortTime;

/**
 * Service class for EffortTime entity
 * This class is used to interact with the EffortTimeRepositoryJpa
 */
@Service
public class EffortTimeService {
    @Autowired
    private EffortTimeRepositoryJpa effortTimeRepository;

    /**
     * Save an effort time
     * @param effortTime The effort time to save
     * @return The saved effort time
     */
    public EffortTime saveEffortTime(EffortTime effortTime) {
        return effortTimeRepository.save(effortTime);
    }
}

