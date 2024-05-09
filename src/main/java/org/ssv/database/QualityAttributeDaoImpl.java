package org.ssv.database;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.database.daoInterface.QualityAttributeDao;
import org.ssv.model.QualityAttribute;
import org.ssv.model.QualityAttributeMS;
import org.ssv.model.QualityAttributeSR;
import org.ssv.model.Relevance;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class QualityAttributeDaoImpl implements QualityAttributeDao {
    private static final String RELEVANCE = "relevance";
    private static final String CATEGORY = "category";
    private static QualityAttributeDaoImpl instance;
    private final Connection connection;
    private static final Logger LOGGER = LoggerFactory.getLogger(QualityAttributeDaoImpl.class);

    private QualityAttributeDaoImpl(String dbUrl) throws SQLException {
        this.connection = DriverManager.getConnection(dbUrl);
        createTable();
    }

    public static synchronized QualityAttributeDaoImpl getInstance() throws SQLException {
        if (instance == null) {
            instance = new QualityAttributeDaoImpl(DatabaseConnection.getSqliteDbUrl());
        }
        return instance;
    }

    private void createTable() {
        try (Statement stmt = connection.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS QualityAttribute (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                    "name TEXT, category TEXT, relevance TEXT, impactsPositively BOOLEAN)");
        } catch (SQLException e) {
            LOGGER.error("Error creating QualityAttribute table", e);
        }
    }

    @Override
    public void insert(QualityAttribute qualityAttribute) throws SQLException {
        String sql = "INSERT INTO QualityAttribute (name, category, relevance, impactsPositively) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            pstmt.setString(1, qualityAttribute.getName());
            pstmt.setString(2, qualityAttribute.getCategory().toString());
            if (qualityAttribute instanceof QualityAttributeMS) {
                pstmt.setString(3, ((QualityAttributeMS) qualityAttribute).getRelevance().toString());
                pstmt.setBoolean(4, false); // Non applicabile
            } else if (qualityAttribute instanceof QualityAttributeSR) {
                pstmt.setNull(3, Types.VARCHAR);
                pstmt.setBoolean(4, ((QualityAttributeSR) qualityAttribute).isImpactsPositively());
            }
            pstmt.executeUpdate();
        } catch (SQLException e) {
            LOGGER.error("Error inserting QualityAttribute", e);
            throw e;
        }
    }

    @Override
    public QualityAttribute findById(int id) throws SQLException {
        QualityAttribute qualityAttribute = null;
        String sql = "SELECT * FROM QualityAttribute WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    String type = rs.getString(RELEVANCE) != null ? "MS" : "SR";
                    if ("MS".equals(type)) {
                        QualityAttributeMS attribute = new QualityAttributeMS();
                        attribute.setId(rs.getInt("id"));
                        attribute.setName(rs.getString("name"));
                        attribute.setCategory(QualityAttribute.Category.valueOf(rs.getString(CATEGORY)));
                        attribute.setRelevance(Relevance.valueOf(rs.getString(RELEVANCE)));
                        qualityAttribute = attribute;
                    } else {
                        QualityAttributeSR attribute = new QualityAttributeSR();
                        attribute.setId(rs.getInt("id"));
                        attribute.setName(rs.getString("name"));
                        attribute.setCategory(QualityAttribute.Category.valueOf(rs.getString(CATEGORY)));
                        attribute.setImpactsPositively(rs.getBoolean("impactsPositively"));
                        qualityAttribute = attribute;
                    }
                }
            }
        }
        return qualityAttribute;
    }

    @Override
    public List<QualityAttribute> findAll() throws SQLException {
        List<QualityAttribute> qualityAttributes = new ArrayList<>();
        String sql = "SELECT * FROM QualityAttribute";
        try (PreparedStatement pstmt = connection.prepareStatement(sql);
             ResultSet rs = pstmt.executeQuery()) {
            while (rs.next()) {
                String type = rs.getString(RELEVANCE) != null ? "MS" : "SR";
                QualityAttribute qualityAttribute;
                if ("MS".equals(type)) {
                    QualityAttributeMS attribute = new QualityAttributeMS();
                    attribute.setId(rs.getInt("id"));
                    attribute.setName(rs.getString("name"));
                    attribute.setCategory(QualityAttribute.Category.valueOf(rs.getString(CATEGORY)));
                    attribute.setRelevance(Relevance.valueOf(rs.getString(RELEVANCE)));
                    qualityAttribute = attribute;
                } else {
                    QualityAttributeSR attribute = new QualityAttributeSR();
                    attribute.setId(rs.getInt("id"));
                    attribute.setName(rs.getString("name"));
                    attribute.setCategory(QualityAttribute.Category.valueOf(rs.getString(CATEGORY)));
                    attribute.setImpactsPositively(rs.getBoolean("impactsPositively"));
                    qualityAttribute = attribute;
                }
                qualityAttributes.add(qualityAttribute);
            }
        }
        return qualityAttributes;
    }

    @Override
    public void update(QualityAttribute qualityAttribute) throws SQLException {
        String sql = "UPDATE QualityAttribute SET name = ?, category = ?, relevance = ?, impactsPositively = ? WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, qualityAttribute.getName());
            pstmt.setString(2, qualityAttribute.getCategory().toString());
            if (qualityAttribute instanceof QualityAttributeMS) {
                pstmt.setString(3, ((QualityAttributeMS) qualityAttribute).getRelevance().toString());
                pstmt.setBoolean(4, false);
            } else if (qualityAttribute instanceof QualityAttributeSR) {
                pstmt.setNull(3, Types.VARCHAR);
                pstmt.setBoolean(4, ((QualityAttributeSR) qualityAttribute).isImpactsPositively());
            }
            pstmt.setInt(5, qualityAttribute.getId());
            pstmt.executeUpdate();
        }
    }

    @Override
    public boolean delete(int id) throws SQLException {
        String sql = "DELETE FROM QualityAttribute WHERE id = ?";
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setInt(1, id);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        }
    }
}

