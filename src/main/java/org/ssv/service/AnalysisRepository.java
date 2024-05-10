package org.ssv.service;

import lombok.Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.ssv.database.AnalysisDaoImpl;
import org.ssv.database.EffortTimeDaoImpl;
import org.ssv.database.QualityAttributeDaoImpl;
import org.ssv.database.SmellDaoImpl;
import org.ssv.database.RefactoringDaoImpl;
import org.ssv.database.MicroserviceDaoImpl;
import org.ssv.database.daoInterface.*;
import org.ssv.model.Analysis;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Data
public class AnalysisRepository {

    private static AnalysisRepository instance;
    private static final Logger LOGGER = LoggerFactory.getLogger(AnalysisRepository.class);
    private static AnalysisDao analysisDao;
    private static SmellDao smellDao;
    private static RefactoringDao refactoringDao;
    private static EffortTimeDao effortTimeDao;
    private static QualityAttributeDao qualityAttributeDao;
    private static MicroserviceDao microserviceDao;

    private AnalysisRepository() throws SQLException {
        analysisDao = AnalysisDaoImpl.getInstance();
        smellDao = SmellDaoImpl.getInstance();
        refactoringDao = RefactoringDaoImpl.getInstance();
        effortTimeDao = EffortTimeDaoImpl.getInstance();
        qualityAttributeDao = QualityAttributeDaoImpl.getInstance();
        microserviceDao = MicroserviceDaoImpl.getInstance();
    }

    public static synchronized AnalysisRepository getInstance() throws SQLException {
        if (instance == null) {
            instance = new AnalysisRepository();
        }
        return instance;
    }

    public void insertAnalysis(Analysis analysis) {
        try{
            analysisDao.insert(analysis);
            smellDao.insertSmellList(analysis.getSmells());
        } catch (SQLException e) {
            LOGGER.error("Error inserting analysis", e);
        }
    }

    /*
    public List<Analysis> getAllAnalysis() {
        try {
            List<Analysis> analyses = analysisDao.findAll();
            for(Analysis analysis : analyses) {
                analysis.setSmells(smellDao.findByAnalysis(analysis));
            }
            return new ArrayList<>();
        } catch (SQLException e) {
            LOGGER.error("Error getting all analysis", e);
            return new ArrayList<>();
        }
    }*/

}
