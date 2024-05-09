package org.ssv.database.daoInterface;

import org.ssv.model.Smell;
import java.sql.SQLException;
import java.util.List;

public interface SmellDao {

    void insertSmellList(List<Smell> smells);

    void insert(Smell smell) throws SQLException;

    Smell findById(int id) throws SQLException;

    List<Smell> findAll() throws SQLException;

    void update(Smell smell) throws SQLException;

    boolean delete(int id) throws SQLException;
}
