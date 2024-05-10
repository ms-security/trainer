package org.ssv.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.database.daoInterface.AnalysisDao;
import org.ssv.exception.DatabaseConnectionException;
import org.ssv.model.Analysis;
import org.ssv.model.Smell;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AnalysisDaoImpl implements AnalysisDao {
    private Connection connection;
    private static AnalysisDaoImpl instance;
    private static final Logger LOGGER = LoggerFactory.getLogger(AnalysisDaoImpl.class);

    private AnalysisDaoImpl(String dbUrl) {
        try {
            connection = DriverManager.getConnection(dbUrl);
            createTable();
            if (connection.isClosed()) {
                throw new DatabaseConnectionException("Connessione al database non riuscita");
            }
        } catch (SQLException | DatabaseConnectionException e) {
            LOGGER.error("Errore durante la connessione al database", e);
        }
    }

    public static synchronized AnalysisDaoImpl getInstance() {
        if (instance == null) {
            instance = new AnalysisDaoImpl(DatabaseConnection.getSqliteDbUrl());
        }
        return instance;
    }

    private void createTable() {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS Analysis (" +
                    "id TEXT PRIMARY KEY, " +
                    "name TEXT, " +
                    "date TEXT, " +
                    "is_favorite BOOLEAN, " +
                    "is_triage_valid BOOLEAN)");
        } catch (SQLException e) {
            LOGGER.error("Error creating table", e);
        }
    }

    @Override
    public void insert(Analysis analysis) throws SQLException {
        String sql = "INSERT INTO analysis (id, name, date, is_favorite, is_triage_valid) VALUES (?, ?, ?, ?, ?)";
        System.out.println("Inserting analysis: " + analysis.getId() + " " +
                analysis.getName() + " " + analysis.getDate() + " " +
                analysis.isFavorite() + " " + analysis.isTriageValid());
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, analysis.getId());
            pstmt.setString(2, analysis.getName());
            pstmt.setString(3, analysis.getDate().toString());
            pstmt.setBoolean(4, analysis.isFavorite());
            pstmt.setBoolean(5, analysis.isTriageValid());
            pstmt.executeUpdate();
        }
        catch (SQLException e) {
            System.out.println("Error inserting analysis: " + e.getMessage());
            e.printStackTrace();
            throw new SQLException("Error inserting analysis: " + e.getMessage());
        }
    }

    @Override
    public Analysis findById(String id) throws SQLException {
        Analysis analysis = null;
        String sql = "SELECT * FROM analysis WHERE id = ?";
        LOGGER.info("Executing SQL query: " + sql);
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    analysis = new Analysis();
                    analysis.setId(rs.getString("id"));
                    analysis.setName(rs.getString("name"));
                    analysis.setDate(LocalDateTime.parse(rs.getString("date")));
                    analysis.setFavorite(rs.getBoolean("is_favorite"));
                    analysis.setTriageValid(rs.getBoolean("is_triage_valid"));
                    LOGGER.info("Finding analysis with id: " + rs.getString("id") + " " + rs.getString("name") + " " + rs.getString("date") + " " + rs.getBoolean("is_favorite") + " " + rs.getBoolean("is_triage_valid"));
                }
            }
        }
        LOGGER.info("Finding analysis: " + analysis);
        return analysis;
    }

    @Override
    public List<Analysis> findAll() throws SQLException {
        List<Analysis> analyses = new ArrayList<>();
        String sql = "SELECT * FROM analysis";
        try (PreparedStatement pstmt = connection.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                Analysis analysis = new Analysis();
                analysis.setId(rs.getString("id"));
                analysis.setName(rs.getString("name"));
                analysis.setDate(LocalDateTime.parse(rs.getString("date")));
                analysis.setFavorite(rs.getBoolean("is_favorite"));
                analysis.setTriageValid(rs.getBoolean("is_triage_valid"));
                analyses.add(analysis);
            }
        }
        return analyses;
    }

    @Override
    public void update(Analysis analysis) throws SQLException {
        String sql = "UPDATE analysis SET name = ?, date = ?, is_favorite = ?, is_triage_valid = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, analysis.getName());
            pstmt.setString(2, analysis.getDate().toString());
            pstmt.setBoolean(3, analysis.isFavorite());
            pstmt.setBoolean(4, analysis.isTriageValid());
            pstmt.setString(5, analysis.getId());
            pstmt.executeUpdate();
        }
    }

    @Override
    public boolean delete(String id) throws SQLException {
        LOGGER.info("Deleting analysis with id: " + id);
        String sql = "DELETE FROM analysis WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
}

