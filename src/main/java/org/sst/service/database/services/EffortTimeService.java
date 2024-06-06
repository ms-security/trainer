package org.sst.service.database.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.sst.service.database.jparepositories.EffortTimeRepositoryJpa;
import org.sst.model.EffortTime;

@Service
public class EffortTimeService {
    @Autowired
    private EffortTimeRepositoryJpa effortTimeRepository;

    // Save a single effort time
    public EffortTime saveEffortTime(EffortTime effortTime) {
        return effortTimeRepository.save(effortTime);
    }
}

