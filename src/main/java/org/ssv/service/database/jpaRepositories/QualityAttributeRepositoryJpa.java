package org.ssv.service.database.jpaRepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.QualityAttribute;

public interface QualityAttributeRepositoryJpa extends JpaRepository<QualityAttribute, Integer> {
}
