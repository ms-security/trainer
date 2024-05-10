package org.ssv.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.database.daoInterface.SmellDao;
import org.ssv.exception.DatabaseConnectionException;
import org.ssv.model.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class SmellDaoImpl implements SmellDao {
    private Connection connection;
    private static SmellDaoImpl instance;
    private static final Logger LOGGER = LoggerFactory.getLogger(SmellDaoImpl.class);

    private SmellDaoImpl(String dbUrl) {
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

    public static synchronized SmellDaoImpl getInstance() {
        if (instance == null) {
            instance = new SmellDaoImpl(DatabaseConnection.getSqliteDbUrl());
        }
        return instance;
    }

    private void createTable() {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS Smell (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "code TEXT, " +
                    "description TEXT, " +
                    "extendedName TEXT, " +
                    "smellTypeDescription TEXT, " +
                    "urgencyCode TEXT, " +
                    "status TEXT, " +
                    "isChecked BOOLEAN, " +
                    "effortTime_id INTEGER, " +
                    "microservice_id INTEGER, " +
                    "refactoring_id INTEGER, " +
                    "analysis_id TEXT, " +
                    "FOREIGN KEY (effortTime_id) REFERENCES effort_time(id), " +
                    "FOREIGN KEY (microservice_id) REFERENCES Microservice(id), " +
                    "FOREIGN KEY (refactoring_id) REFERENCES Refactoring(id), " +
                    "FOREIGN KEY (analysis_id) REFERENCES Analysis(id))");
        } catch (SQLException e) {
            LOGGER.error("Error creating table", e);
        }
    }

    @Override
    public void insertSmellList(List<Smell> smells) {
        for (Smell smell : smells) {
            try {
                insert(smell);
            } catch (SQLException e) {
                LOGGER.error("Error inserting smell: " + e.getMessage());
            }
        }
    }

    @Override
    public void insert(Smell smell) throws SQLException {
        LOGGER.info("Inserting smell: " + smell.getCode());
        String sql = "INSERT INTO Smell (code, description, extended_name, smell_type_description, urgency_code, " +
                "status, is_checked, effort_time_id, microservice_id, refactoring_id, analysis_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, smell.getCode());
            pstmt.setString(2, smell.getDescription());
            pstmt.setString(3, smell.getExtendedName());
            pstmt.setString(4, smell.getSmellTypeDescription());
            pstmt.setString(5, smell.getUrgencyCode() != null ? smell.getUrgencyCode().toString() : null);
            pstmt.setString(6, smell.getStatus().toString());
            pstmt.setBoolean(7, smell.isChecked());
            pstmt.setObject(8, smell.getEffortTime() != null ? smell.getEffortTime().getId() : null, Types.INTEGER);
            pstmt.setObject(9, smell.getMicroservice() != null ? smell.getMicroservice().getId() : null, Types.INTEGER);
            pstmt.setObject(10, smell.getRefactoring() != null ? smell.getRefactoring().getId() : null, Types.INTEGER);
            pstmt.setString(11, smell.getAnalysis().getId());
            pstmt.executeUpdate();
            LOGGER.info("Inserted smell: " + smell.getCode());

            /*   // Optional: Retrieve the auto-generated key (id) if needed
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    smell.setId(generatedKeys.getInt(1));
                }
            }*/
        } catch (Exception e) {
            LOGGER.error("Error inserting smell", e);
            throw new SQLException("Error inserting smell: " + e.getMessage());
        }
    }

    @Override
    public Smell findById(int id) throws SQLException {
        Smell smell = null;
        String sql = "SELECT * FROM Smell WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    smell = buildSmellFromResultSet(rs);
                }
            }
        }
        return smell;
    }

    @Override
    public List<Smell> findAll() throws SQLException {
        List<Smell> smells = new ArrayList<>();
        String sql = "SELECT * FROM Smell";
        try (PreparedStatement pstmt = connection.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                smells.add(buildSmellFromResultSet(rs));
            }
        }
        return smells;
    }



    @Override
    public void update(Smell smell) throws SQLException {
        String sql = "UPDATE Smell SET code = ?, description = ?, extended_name = ?, smell_type_description = ?, " +
                "urgency_code = ?, status = ?, is_checked = ?, effortTime_id = ?, microservice_id = ?, " +
                "refactoring_id = ?, analysis_id = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, smell.getCode());
            pstmt.setString(2, smell.getDescription());
            pstmt.setString(3, smell.getExtendedName());
            pstmt.setString(4, smell.getSmellTypeDescription());
            pstmt.setString(5, smell.getUrgencyCode().toString());
            pstmt.setString(6, smell.getStatus().toString());
            pstmt.setBoolean(7, smell.isChecked());
            pstmt.setObject(8, smell.getEffortTime() != null ? smell.getEffortTime().getId() : null, Types.INTEGER);
            pstmt.setObject(9, smell.getMicroservice() != null ? smell.getMicroservice().getId() : null, Types.INTEGER);
            pstmt.setObject(10, smell.getRefactoring() != null ? smell.getRefactoring().getId() : null, Types.INTEGER);
            pstmt.setString(11, smell.getAnalysis().getId());
            pstmt.setInt(12, smell.getId());
            pstmt.executeUpdate();
        }
    }

    @Override
    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM Smell WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }

    private Smell buildSmellFromResultSet(ResultSet rs) throws SQLException {
        Smell smell = new Smell();
        smell.setId(rs.getInt("id"));
        smell.setCode(rs.getString("code"));
        smell.setDescription(rs.getString("description"));
        smell.setExtendedName(rs.getString("extendedName"));
        smell.setSmellTypeDescription(rs.getString("smellTypeDescription"));
        smell.setUrgencyCode(UrgencyCode.valueOf(rs.getString("urgencyCode")));
        smell.setStatus(SmellStatus.valueOf(rs.getString("status")));
        smell.setChecked(rs.getBoolean("isChecked"));

        // Set EffortTime reference if present
        int effortTimeId = rs.getInt("effortTime_id");
        if (!rs.wasNull()) {
            EffortTime effortTime = new EffortTime();
            effortTime.setId(effortTimeId);
            smell.setEffortTime(effortTime);
        }

        // Set Microservice reference if present
        int microserviceId = rs.getInt("microservice_id");
        if (!rs.wasNull()) {
            Microservice microservice = new Microservice();
            microservice.setId(microserviceId);
            smell.setMicroservice(microservice);
        }

        // Set Refactoring reference if present
        int refactoringId = rs.getInt("refactoring_id");
        if (!rs.wasNull()) {
            Refactoring refactoring = new Refactoring();
            refactoring.setId(refactoringId);
            smell.setRefactoring(refactoring);
        }

        // Set Analysis reference
        Analysis analysis = new Analysis();
        analysis.setId(rs.getString("analysis_id"));
        smell.setAnalysis(analysis);

        return smell;
    }
}
