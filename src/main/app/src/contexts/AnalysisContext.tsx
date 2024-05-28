import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import WebController from '../application/WebController';
import { Analysis } from "../interfaces/Analysis";
import {Smell} from "../interfaces/Smell";
import {EffortTime} from "../interfaces/EffortTime";
import {SmellFilter} from "../interfaces/SmellFilter";


interface AnalysisContextType {
    analyses: Analysis[];
    fetchAnalyses: () => Promise<void>;
    fetchAnalysisById: (id: string) => Promise<Analysis | undefined>;
    addAnalysis: (file: File, name: string, date: string, extension: string) => Promise<void>;
    deleteAnalysis: (analysisId: string) => Promise<void>;
    toggleFavoriteStatus: (analysisId: string) => Promise<void>;
    addMicroservice: (data: any, analysisId: string) => Promise<void>;
    updateMicroservice: (data: any, analysisId: string) => Promise<void>;
    getSmellById: (analysisId: string, smellId: number) => Promise<Smell | undefined>;
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
    const [analyses, setAnalyses] = useState<Analysis[]>([]);

    const handleError = (error: any) => {
        console.error(error);
    };

    const fetchAnalyses = useCallback(async () => {
        try {
            const data = await WebController.fetchAllAnalyses();
            setAnalyses(data);
        } catch (error) {
            handleError(error);
        }
    }, []);

    const addAnalysis = async (file: File, name: string, date: string, extension: string) => {
        try {
            const analysis = await WebController.newAnalysis(file, name, date, extension);
            setAnalyses(prev => [...prev, analysis]);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchAnalysisById = useCallback(async (id: string): Promise<Analysis | undefined> => {
        try {
            const analysis = await WebController.fetchAnalysis(id);
            setAnalyses(prev => {
                const index = prev.findIndex(a => a.id === id);
                if (index !== -1) {
                    const updatedAnalyses = [...prev];
                    updatedAnalyses[index] = analysis;
                    return updatedAnalyses;
                }
                return prev;
            });
            return analysis;
        } catch (error) {
            handleError(error);
            return undefined;
        }
    }, []);

    const deleteAnalysis = async (analysisId: string) => {
        try {
            await WebController.deleteAnalysis(analysisId);
            setAnalyses(prev => prev.filter(a => a.id !== analysisId));
        } catch (error) {
            handleError(error);
        }
    };

    const toggleFavoriteStatus = async (analysisId: string) => {
        try {
            await WebController.toggleFavoriteStatus(analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };

    const addMicroservice = async (data: any, analysisId: string) => {
        try {
            await WebController.newMicroservice(data, analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };

    const updateMicroservice = async (data: any, analysisId: string) => {
        try {
            await WebController.updateMicroservice(data, analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };

    const deleteMicroservice = async (analysisId: string, microserviceId: number) => {
        try {
            await WebController.deleteMicroservice(analysisId, microserviceId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };


    const addSmellToMicroservice = async (analysisId: string, microserviceId: number, smellId: number) => {
        try {
            await WebController.addSmellToMicroservice(analysisId, microserviceId, smellId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };

    const multipleAssignments = async (analysisId: string, microserviceId: number, smellsIds: number[]) => {
        try {
            await WebController.multipleMicroserviceAssignment(analysisId, microserviceId, smellsIds);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };
    const getSmellById = async (analysisId: string, smellId: number): Promise<Smell | undefined> => {
        try {
            const analysis = await WebController.fetchAnalysis(analysisId);
            return analysis.smells.find(smell => smell.id === smellId);
        } catch (error) {
            handleError(error);
            return undefined;
        }
    };

    const addEffortTime = async (analysisId: string, smellId: number, effortTime: EffortTime) => {
        try {
            console.log("Adding effort time:", effortTime);
            await WebController.addEffortTime(analysisId, smellId, effortTime);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };

    const changeCheckboxValue = async (analysisId: string, smellId: number, checkboxValue: boolean) => {
        try {
            await WebController.changeCheckboxValue(analysisId, smellId, checkboxValue);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };

    const changeSmellStatus = async (analysisId: string, smellId: number, newStatus: string) => {
        try {
            await WebController.changeSmellStatus(analysisId, smellId, newStatus);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            handleError(error);
        }
    };

    useEffect(() => {
        fetchAnalyses();
    }, [fetchAnalyses]);

    return (
        <AnalysisContext.Provider value={{
            analyses,
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
