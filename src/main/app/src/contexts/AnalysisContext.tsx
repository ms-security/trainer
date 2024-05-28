import React, { createContext, useContext, useState, useCallback } from 'react';
import WebController from '../application/WebController';
import { Analysis } from "../interfaces/Analysis";
import {Smell} from "../interfaces/Smell";
import {EffortTime} from "../interfaces/EffortTime";
import {SmellFilter} from "../interfaces/SmellFilter";


interface AnalysisContextType {
    fetchAnalyses: () => Promise<Analysis[]>;
    fetchAnalysisById: (id: string) => Promise<Analysis>;
    addAnalysis: (file: File, name: string, date: string, extension: string) => Promise<void>;
    deleteAnalysis: (analysisId: string) => Promise<void>;
    toggleFavoriteStatus: (analysisId: string) => Promise<void>;
    addMicroservice: (data: any, analysisId: string) => Promise<void>;
    updateMicroservice: (data: any, analysisId: string) => Promise<void>;
    getSmellById: (analysisId: string, smellId: number) => Promise<Smell>;
    addSmellToMicroservice: (analysisId: string, microserviceId: number, smellId: number) => Promise<void>;
    multipleAssignments: (analysisId: string, microserviceId: number, smellsId: number[]) => Promise<void>;
    deleteMicroservice: (analysisId: string, microserviceId: number) => Promise<void>;
    addEffortTime: (analysisId: string, smellId: number, effortTime: EffortTime) => Promise<void>;
    changeCheckboxValue: (analysisId: string, smellId: number, checkboxValue: boolean) => Promise<void>;
    changeSmellStatus: (analysisId: string, smellId: number, newStatus: string) => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (!context) throw new Error('useAnalysis must be used within an AnalysisProvider');
    return context;
};


export const AnalysisProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {

    const handleError = (error: any) => {
        console.error(error);
    };

    const fetchAnalyses = useCallback(async (): Promise<Analysis[]> => {
        try {
            return await WebController.fetchAllAnalyses();
        } catch (error) {
            handleError(error);
            return [];
        }
    }, []);

    const addAnalysis = useCallback(async (file: File, name: string, date: string, extension: string): Promise<void> => {
        try {
            return await WebController.newAnalysis(file, name, date, extension);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const fetchAnalysisById = useCallback(async (id: string): Promise<Analysis> => {
        try {
            return await WebController.fetchAnalysis(id);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const deleteAnalysis = useCallback(async (analysisId: string): Promise<void> => {
        try {
            await WebController.deleteAnalysis(analysisId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const toggleFavoriteStatus = useCallback(async (analysisId: string): Promise<void> => {
        try {
            await WebController.toggleFavoriteStatus(analysisId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const addMicroservice = useCallback(async (data: any, analysisId: string): Promise<void> => {
        try {
            await WebController.newMicroservice(data, analysisId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const updateMicroservice = useCallback(async (data: any, analysisId: string): Promise<void> => {
        try {
            await WebController.updateMicroservice(data, analysisId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const deleteMicroservice = useCallback(async (analysisId: string, microserviceId: number): Promise<void> => {
        try {
            await WebController.deleteMicroservice(analysisId, microserviceId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);


    const addSmellToMicroservice = useCallback(async (analysisId: string, microserviceId: number, smellId: number): Promise<void> => {
        try {
            await WebController.addSmellToMicroservice(analysisId, microserviceId, smellId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const multipleAssignments = useCallback(async (analysisId: string, microserviceId: number, smellsIds: number[]): Promise<void> => {
        try {
            await WebController.multipleMicroserviceAssignment(analysisId, microserviceId, smellsIds);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const getSmellById = useCallback(async (analysisId: string, smellId: number): Promise<Smell> => {
        try {
            return await WebController.fetchSmellById(analysisId, smellId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const addEffortTime = useCallback(async (analysisId: string, smellId: number, effortTime: EffortTime): Promise<void> => {
        try {
            await WebController.addEffortTime(analysisId, smellId, effortTime);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const changeCheckboxValue = useCallback(async (analysisId: string, smellId: number, checkboxValue: boolean): Promise<void> => {
        try {
            await WebController.changeCheckboxValue(analysisId, smellId, checkboxValue);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    const changeSmellStatus = useCallback(async (analysisId: string, smellId: number, newStatus: string): Promise<void> => {
        try {
            await WebController.changeSmellStatus(analysisId, smellId, newStatus);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, []);

    return (
        <AnalysisContext.Provider value={{
            fetchAnalyses,
            addAnalysis,
            fetchAnalysisById,
            deleteAnalysis,
            getSmellById,
            addSmellToMicroservice,
            multipleAssignments,
            toggleFavoriteStatus,
            addMicroservice,
            updateMicroservice,
            deleteMicroservice,
            addEffortTime,
            changeCheckboxValue,
            changeSmellStatus
        }}>
            {children}
        </AnalysisContext.Provider>
    );
};
