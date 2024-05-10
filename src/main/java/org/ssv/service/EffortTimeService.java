package org.ssv.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.ssv.database.jpaRepositories.EffortTimeRepositoryJpa;
import org.ssv.model.EffortTime;

import java.util.List;

@Service
public class EffortTimeService {
    @Autowired
    private EffortTimeRepositoryJpa effortTimeRepository;

    // Save a single effort time
    public EffortTime saveEffortTime(EffortTime effortTime) {
        return effortTimeRepository.save(effortTime);
    }
}

