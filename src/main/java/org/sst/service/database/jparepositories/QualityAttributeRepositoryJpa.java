package org.sst.service.database.jparepositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.sst.model.QualityAttribute;

public interface QualityAttributeRepositoryJpa extends JpaRepository<QualityAttribute, Integer> {
}
