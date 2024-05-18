import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import WebController from '../application/WebController';
import { Analysis } from "../interfaces/Analysis";
import {Smell} from "../interfaces/Smell";
import {EffortTime} from "../interfaces/EffortTime";
import {SmellFilter} from "../interfaces/SmellFilter";


interface AnalysisContextType {
    analyses: Analysis[];
    filters: SmellFilter;
    setFilters: (newFilters: SmellFilter) => void;
    fetchAnalyses: () => Promise<void>;
    fetchAnalysisById: (id: string) => Promise<Analysis | undefined>;
    addAnalysis: (file: File, name: string, date: string, extension: string) => Promise<void>;
    deleteAnalysis: (analysisId: string) => Promise<void>;
    toggleFavoriteStatus: (analysisId: string) => Promise<void>;
    addMicroservice: (data: any, analysisId: string) => Promise<void>;
    updateMicroservice: (data: any, analysisId: string) => Promise<void>;
    getSmellById: (analysisId: string, smellId: number) => Smell | undefined;
    addSmellToMicroservice: (analysisId: string, microserviceId: string, smellId: number) => Promise<void>;
    deleteMicroservice: (analysisId: string, microserviceName: string) => Promise<void>;
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
    const [filters, setFilters] = useState<SmellFilter>({});

    const fetchAnalyses = useCallback(async () => {
        try {
            const data = await WebController.fetchAllAnalyses();
            setAnalyses(data);
        } catch (error) {
            console.error('Failed to fetch analyses:', error);
        }
    }, []);

    const addAnalysis = async (file: File, name: string, date: string, extension: string) => {
        const analysis = await WebController.newAnalysis(file, name, date, extension);
        setAnalyses(prev => [...prev, analysis]);
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
            console.error('Failed to fetch analysis:', error);
            return undefined;
        }
    }, []);

    const deleteAnalysis = async (analysisId: string) => {
        try {
            await WebController.deleteAnalysis(analysisId);
            setAnalyses(prev => prev.filter(a => a.id !== analysisId));
        } catch (error) {
            console.error('Failed to delete analysis:', error);
        }
    };

    const toggleFavoriteStatus = async (analysisId: string) => {
        try {
            await WebController.toggleFavoriteStatus(analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to update favorite status:', error);
        }
    };

    const addMicroservice = async (data: any, analysisId: string) => {
        try {
            await WebController.newMicroservice(data, analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to add microservice:', error);
        }
    };

    const updateMicroservice = async (data: any, analysisId: string) => {
        try {
            await WebController.updateMicroservice(data, analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to update microservice:', error);
        }
    };

    const deleteMicroservice = async (analysisId: string, microserviceName: string) => {
        try {
            await WebController.deleteMicroservice(analysisId, microserviceName);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to delete microservice:', error);
        }
    }


    const addSmellToMicroservice = async (analysisId: string, microserviceId: string, smellId: number) => {
        try {
            await WebController.addSmellToMicroservice(analysisId, microserviceId, smellId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to add smell to microservice:', error);
        }
    };

    const getSmellById = useCallback((analysisId: string, smellId: number) => {
        const analysis = analyses.find(a => a.id === analysisId);
        console.log("ciao ddw");
        if (analysis) {
            return analysis.smells.find(s => s.id === smellId);
        }
        return undefined;
    }, [analyses]);

    const addEffortTime = async (analysisId: string, smellId: number, effortTime: EffortTime) => {
        try {
            console.log("Adding effort time:", effortTime);
            await WebController.addEffortTime(analysisId, smellId, effortTime);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to add effort time:', error);
        }
    };

    const changeCheckboxValue = async (analysisId: string, smellId: number, checkboxValue: boolean) => {
        try {
            await WebController.changeCheckboxValue(analysisId, smellId, checkboxValue);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to change checkbox value:', error);
        }
    };

    const changeSmellStatus = async (analysisId: string, smellId: number, newStatus: string) => {
        try {
            await WebController.changeSmellStatus(analysisId, smellId, newStatus);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to change smell status:', error);
        }
    }

    useEffect(() => {
        fetchAnalyses();
    }, [fetchAnalyses]);

    return (
        <AnalysisContext.Provider value={{
            analyses,
            filters,
            setFilters,
            fetchAnalyses,
            addAnalysis,
            fetchAnalysisById,
            deleteAnalysis,
            getSmellById,
            addSmellToMicroservice,
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
