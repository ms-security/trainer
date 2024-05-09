package org.ssv.database.daoInterface;

import org.ssv.model.Analysis;
import java.sql.SQLException;
import java.util.List;

public interface AnalysisDao {
    void insert(Analysis analysis) throws SQLException;
    Analysis findById(String id) throws SQLException;
    List<Analysis> findAll() throws SQLException;
    void update(Analysis analysis) throws SQLException;
    boolean delete(String id) throws SQLException;
}
