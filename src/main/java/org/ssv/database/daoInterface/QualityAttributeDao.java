package org.ssv.database.daoInterface;

import org.ssv.model.QualityAttribute;
import java.sql.SQLException;
import java.util.List;

public interface QualityAttributeDao {
    void insert(QualityAttribute qualityAttribute) throws SQLException;
    QualityAttribute findById(int id) throws SQLException;
    List<QualityAttribute> findAll() throws SQLException;
    void update(QualityAttribute qualityAttribute) throws SQLException;
    boolean delete(int id) throws SQLException;
}

