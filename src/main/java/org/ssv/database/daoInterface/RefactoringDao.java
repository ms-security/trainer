package org.ssv.database.daoInterface;

import org.ssv.model.Refactoring;

import java.sql.SQLException;
import java.util.List;

public interface RefactoringDao {
    void insert(Refactoring refactoring) throws SQLException;
    Refactoring findById(int id) throws SQLException;
    List<Refactoring> findAll() throws SQLException;
    void update(Refactoring refactoring) throws SQLException;
    boolean delete(int id) throws SQLException;
}

