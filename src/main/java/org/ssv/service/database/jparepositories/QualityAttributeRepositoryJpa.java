package org.ssv.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssv.model.QualityAttribute;

public interface QualityAttributeRepositoryJpa extends JpaRepository<QualityAttribute, Integer> {
}
