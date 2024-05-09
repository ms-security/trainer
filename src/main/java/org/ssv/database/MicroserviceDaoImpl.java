package org.ssv.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.database.daoInterface.MicroserviceDao;
import org.ssv.model.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MicroserviceDaoImpl implements MicroserviceDao {
    private Connection connection;
    private static final Logger LOGGER = LoggerFactory.getLogger(MicroserviceDaoImpl.class);
    private static MicroserviceDaoImpl instance;

    private MicroserviceDaoImpl(String dbUrl) {
        try {
            connection = DriverManager.getConnection(dbUrl);
            createTable();
        } catch (SQLException e) {
            LOGGER.error("Errore durante la connessione al database", e);
        }
    }

    public static synchronized MicroserviceDaoImpl getInstance() {
        if (instance == null) {
            instance = new MicroserviceDaoImpl(DatabaseConnection.getSqliteDbUrl());
        }
        return instance;
    }

    private void createTable() {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS Microservice (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "name TEXT NOT NULL, " +
                    "relevance TEXT NOT NULL)");
            /*stmt.execute("CREATE TABLE IF NOT EXISTS microservice_quality (" +
                    "microservice_id INTEGER, " +
                    "quality_attribute_id INTEGER, " +
                    "PRIMARY KEY (microservice_id, quality_attribute_id), " +
                    "FOREIGN KEY (microservice_id) REFERENCES Microservice(id), " +
                    "FOREIGN KEY (quality_attribute_id) REFERENCES QualityAttribute(id))")*/;
        } catch (SQLException e) {
            LOGGER.error("Error creating tables", e);
        }
    }

    @Override
    public void insert(Microservice microservice) throws SQLException {
        String sql = "INSERT INTO Microservice (name, relevance) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, microservice.getName());
            pstmt.setString(2, microservice.getRelevance().toString());
            pstmt.executeUpdate();

            // Retrieve the generated key and set it to the object
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    microservice.setId(generatedKeys.getInt(1));
                }
            }
        }

        // Now insert the many-to-many relationships
        insertQualityAttributes(microservice);
    }

    private void insertQualityAttributes(Microservice microservice) throws SQLException {
        if (microservice.getQualityAttributes() == null) return;

        String sql = "INSERT INTO microservice_quality (microservice_id, quality_attribute_id) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            for (QualityAttribute qa : microservice.getQualityAttributes()) {
                pstmt.setInt(1, microservice.getId());
                pstmt.setInt(2, qa.getId());
                pstmt.addBatch();
            }
            pstmt.executeBatch();
        }
    }

    @Override
    public Microservice findById(int id) throws SQLException {
        Microservice microservice = null;
        String sql = "SELECT * FROM Microservice WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    microservice = new Microservice();
                    microservice.setId(rs.getInt("id"));
                    microservice.setName(rs.getString("name"));
                    microservice.setRelevance(Relevance.valueOf(rs.getString("relevance")));
                }
            }
        }

        if (microservice != null) {
            microservice.setQualityAttributes(findQualityAttributesByMicroserviceId(id));
        }
        return microservice;
    }

    private List<QualityAttribute> findQualityAttributesByMicroserviceId(int microserviceId) throws SQLException {
        List<QualityAttribute> qualityAttributes = new ArrayList<>();
        String sql = "SELECT qa.id, qa.attributeName FROM QualityAttribute qa " +
                "JOIN microservice_quality mq ON qa.id = mq.quality_attribute_id " +
                "WHERE mq.microservice_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, microserviceId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    QualityAttribute qa = new QualityAttributeMS();
                    qa.setId(rs.getInt("id"));
                    qa.setName(rs.getString("attributeName"));
                    qualityAttributes.add(qa);
                }
            }
        }
        return qualityAttributes;
    }

    @Override
    public List<Microservice> findAll() throws SQLException {
        List<Microservice> microservices = new ArrayList<>();
        String sql = "SELECT * FROM Microservice";
        try (PreparedStatement pstmt = connection.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Microservice microservice = new Microservice();
                microservice.setId(rs.getInt("id"));
                microservice.setName(rs.getString("name"));
                microservice.setRelevance(Relevance.valueOf(rs.getString("relevance")));
                microservice.setQualityAttributes(findQualityAttributesByMicroserviceId(rs.getInt("id")));
                microservices.add(microservice);
            }
        }
        return microservices;
    }

    @Override
    public void update(Microservice microservice) throws SQLException {
        String sql = "UPDATE Microservice SET name = ?, relevance = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, microservice.getName());
            pstmt.setString(2, microservice.getRelevance().toString());
            pstmt.setInt(3, microservice.getId());
            pstmt.executeUpdate();
        }

        // Update many-to-many relationships
        deleteQualityAttributes(microservice.getId());
        insertQualityAttributes(microservice);
    }

    private void deleteQualityAttributes(int microserviceId) throws SQLException {
        String sql = "DELETE FROM microservice_quality WHERE microservice_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, microserviceId);
            pstmt.executeUpdate();
        }
    }

    @Override
    public boolean delete(int id) throws SQLException {
        deleteQualityAttributes(id);
        String sql = "DELETE FROM Microservice WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
}
