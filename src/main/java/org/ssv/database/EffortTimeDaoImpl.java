package org.ssv.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.database.daoInterface.EffortTimeDao;
import org.ssv.model.EffortTime;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EffortTimeDaoImpl implements EffortTimeDao {
    private Connection connection;
    private static EffortTimeDaoImpl instance;
    private static final Logger LOGGER = LoggerFactory.getLogger(EffortTimeDaoImpl.class);

    private EffortTimeDaoImpl(String dbUrl) {
        try {
            connection = DriverManager.getConnection(dbUrl);
            createTable();
            if (connection.isClosed()) {
                throw new SQLException("Connessione al database non riuscita");
            }
        } catch (SQLException e) {
            LOGGER.error("Errore durante la connessione al database", e);
        }
    }

    public static synchronized EffortTimeDaoImpl getInstance() {
        if (instance == null) {
            instance = new EffortTimeDaoImpl(DatabaseConnection.getSqliteDbUrl());
        }
        return instance;
    }

    private void createTable() {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS EffortTime (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "value INTEGER, " +
                    "unitOfTime TEXT)");
        } catch (SQLException e) {
            LOGGER.error("Errore durante la creazione della tabella EffortTime", e);
        }
    }

    @Override
    public void insert(EffortTime effortTime) throws SQLException {
        String sql = "INSERT INTO EffortTime (value, unitOfTime) VALUES (?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setInt(1, effortTime.getValue());
            pstmt.setString(2, effortTime.getUnitOfTime().toString());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            LOGGER.error("Errore durante l'inserimento dell'EffortTime", e);
            throw new SQLException("Errore durante l'inserimento dell'EffortTime", e);
        }
    }

    @Override
    public EffortTime findById(int id) throws SQLException {
        EffortTime effortTime = null;
        String sql = "SELECT * FROM EffortTime WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    effortTime = EffortTime.builder()
                            .id(rs.getInt("id"))
                            .value(rs.getInt("value"))
                            .unitOfTime(EffortTime.UnitOfTime.valueOf(rs.getString("unitOfTime")))
                            .build();
                }
            }
        } catch (SQLException e) {
            LOGGER.error("Errore durante la ricerca dell'EffortTime per id", e);
            throw new SQLException("Errore durante la ricerca dell'EffortTime per id", e);
        }
        return effortTime;
    }

    @Override
    public List<EffortTime> findAll() throws SQLException {
        List<EffortTime> effortTimes = new ArrayList<>();
        String sql = "SELECT * FROM EffortTime";
        try (PreparedStatement pstmt = connection.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                EffortTime effortTime = EffortTime.builder()
                        .id(rs.getInt("id"))
                        .value(rs.getInt("value"))
                        .unitOfTime(EffortTime.UnitOfTime.valueOf(rs.getString("unitOfTime")))
                        .build();
                effortTimes.add(effortTime);
            }
        } catch (SQLException e) {
            LOGGER.error("Errore durante la ricerca di tutti gli EffortTime", e);
            throw new SQLException("Errore durante la ricerca di tutti gli EffortTime", e);
        }
        return effortTimes;
    }

    @Override
    public void update(EffortTime effortTime) throws SQLException {
        String sql = "UPDATE EffortTime SET value = ?, unitOfTime = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, effortTime.getValue());
            pstmt.setString(2, effortTime.getUnitOfTime().toString());
            pstmt.setInt(3, effortTime.getId());
            pstmt.executeUpdate();
        } catch (SQLException e) {
            LOGGER.error("Errore durante l'aggiornamento dell'EffortTime", e);
            throw new SQLException("Errore durante l'aggiornamento dell'EffortTime", e);
        }
    }

    @Override
    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM EffortTime WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            LOGGER.error("Errore durante l'eliminazione dell'EffortTime", e);
            throw new SQLException("Errore durante l'eliminazione dell'EffortTime", e);
        }
    }
}

