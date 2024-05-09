package org.ssv.database.daoInterface;

import org.ssv.model.EffortTime;

import java.sql.SQLException;
import java.util.List;

public interface EffortTimeDao {
    void insert(EffortTime effortTime) throws SQLException;
    EffortTime findById(int id) throws SQLException;
    List<EffortTime> findAll() throws SQLException;
    void update(EffortTime effortTime) throws SQLException;
    boolean delete(int id) throws SQLException;
}

