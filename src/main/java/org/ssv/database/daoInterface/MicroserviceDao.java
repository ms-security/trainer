package org.ssv.database.daoInterface;

import org.ssv.model.Microservice;

import java.sql.SQLException;
import java.util.List;

public interface MicroserviceDao {
    void insert(Microservice microservice) throws SQLException;
    Microservice findById(int id) throws SQLException;
    List<Microservice> findAll() throws SQLException;
    void update(Microservice microservice) throws SQLException;
    boolean delete(int id) throws SQLException;
}

