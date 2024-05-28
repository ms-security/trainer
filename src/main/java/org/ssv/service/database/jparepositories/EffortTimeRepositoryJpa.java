package org.ssv.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.EffortTime;

public interface EffortTimeRepositoryJpa extends JpaRepository<EffortTime, Integer> {
    // Additional queries can be added if required
}
