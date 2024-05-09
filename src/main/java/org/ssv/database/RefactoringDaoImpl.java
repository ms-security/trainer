package org.ssv.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.database.daoInterface.RefactoringDao;
import org.ssv.model.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RefactoringDaoImpl implements RefactoringDao {
    private Connection connection;
    private static final Logger LOGGER = LoggerFactory.getLogger(RefactoringDaoImpl.class);
    private static RefactoringDaoImpl instance;

    private RefactoringDaoImpl(String dbUrl) {
        try {
            connection = DriverManager.getConnection(dbUrl);
            createTable();
        } catch (SQLException e) {
            LOGGER.error("Errore durante la connessione al database", e);
        }
    }

    public static synchronized RefactoringDaoImpl getInstance() {
        if (instance == null) {
            instance = new RefactoringDaoImpl(DatabaseConnection.getSqliteDbUrl());
        }
        return instance;
    }

    private void createTable() {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS Refactoring (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "name TEXT NOT NULL, " +
                    "refactor TEXT NOT NULL)");
            stmt.execute("CREATE TABLE IF NOT EXISTS refactoring_quality (" +
                    "refactoring_id INTEGER, " +
                    "quality_attribute_id INTEGER, " +
                    "PRIMARY KEY (refactoring_id, quality_attribute_id), " +
                    "FOREIGN KEY (refactoring_id) REFERENCES Refactoring(id), " +
                    "FOREIGN KEY (quality_attribute_id) REFERENCES QualityAttribute(id))");
        } catch (SQLException e) {
            LOGGER.error("Error creating tables", e);
        }
    }

    @Override
    public void insert(Refactoring refactoring) throws SQLException {
        String sql = "INSERT INTO Refactoring (name, refactor) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, refactoring.getName());
            pstmt.setString(2, refactoring.getRefactor());
            pstmt.executeUpdate();

            // Retrieve the generated key and set it to the object
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    refactoring.setId(generatedKeys.getInt(1));
                }
            }
        }

        // Now insert the many-to-many relationships
        insertQualityAttributes(refactoring);
    }

    private void insertQualityAttributes(Refactoring refactoring) throws SQLException {
        if (refactoring.getPropertiesAffected() == null) return;

        String sql = "INSERT INTO refactoring_quality (refactoring_id, quality_attribute_id) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            for (QualityAttribute qa : refactoring.getPropertiesAffected()) {
                pstmt.setInt(1, refactoring.getId());
                pstmt.setInt(2, qa.getId());
                pstmt.addBatch();
            }
            pstmt.executeBatch();
        }
    }

    @Override
    public Refactoring findById(int id) throws SQLException {
        Refactoring refactoring = null;
        String sql = "SELECT * FROM Refactoring WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    refactoring = new Refactoring();
                    refactoring.setId(rs.getInt("id"));
                    refactoring.setName(rs.getString("name"));
                    refactoring.setRefactor(rs.getString("refactor"));
                }
            }
        }

        if (refactoring != null) {
            refactoring.setPropertiesAffected(findQualityAttributesByRefactoringId(id));
        }
        return refactoring;
    }

    private List<QualityAttribute> findQualityAttributesByRefactoringId(int refactoringId) throws SQLException {
        List<QualityAttribute> qualityAttributes = new ArrayList<>();
        String sql = "SELECT qa.id, qa.attributeName FROM QualityAttribute qa " +
                "JOIN refactoring_quality rq ON qa.id = rq.quality_attribute_id " +
                "WHERE rq.refactoring_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, refactoringId);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    QualityAttribute qa = new QualityAttributeSR();
                    qa.setId(rs.getInt("id"));
                    qa.setName(rs.getString("attributeName"));
                    qualityAttributes.add(qa);
                }
            }
        }
        return qualityAttributes;
    }

    @Override
    public List<Refactoring> findAll() throws SQLException {
        List<Refactoring> refactorings = new ArrayList<>();
        String sql = "SELECT * FROM Refactoring";
        try (PreparedStatement pstmt = connection.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Refactoring refactoring = new Refactoring();
                refactoring.setId(rs.getInt("id"));
                refactoring.setName(rs.getString("name"));
                refactoring.setRefactor(rs.getString("refactor"));
                refactoring.setPropertiesAffected(findQualityAttributesByRefactoringId(rs.getInt("id")));
                refactorings.add(refactoring);
            }
        }
        return refactorings;
    }

    @Override
    public void update(Refactoring refactoring) throws SQLException {
        String sql = "UPDATE Refactoring SET name = ?, refactor = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, refactoring.getName());
            pstmt.setString(2, refactoring.getRefactor());
            pstmt.setInt(3, refactoring.getId());
            pstmt.executeUpdate();
        }

        // Update many-to-many relationships
        deleteQualityAttributes(refactoring.getId());
        insertQualityAttributes(refactoring);
    }

    private void deleteQualityAttributes(int refactoringId) throws SQLException {
        String sql = "DELETE FROM refactoring_quality WHERE refactoring_id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, refactoringId);
            pstmt.executeUpdate();
        }
    }

    @Override
    public boolean delete(int id) throws SQLException {
        deleteQualityAttributes(id);
        String sql = "DELETE FROM Refactoring WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
}
