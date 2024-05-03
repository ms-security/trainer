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
    fetchAnalysisById: (id: number) => Promise<Analysis | undefined>;
    addAnalysis: (file: File, name: string, date: string) => Promise<void>;
    deleteAnalysis: (analysisId: number) => Promise<void>;
    toggleFavoriteStatus: (analysisId: number) => Promise<void>;
    addMicroservice: (data: any, analysisId: number) => Promise<void>;
    updateMicroservice: (data: any, analysisId: number) => Promise<void>;
    getSmellById: (analysisId: number, smellId: number) => Smell | undefined;
    addSmellToMicroservice: (analysisId: number, microserviceId: string, smellId: number) => Promise<void>;
    deleteMicroservice: (analysisId: number, microserviceName: string) => Promise<void>;
    addEffortTime: (analysisId: number, smellId: number, effortTime: EffortTime) => Promise<void>;
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

    const addAnalysis = async (file: File, name: string, date: string) => {
        const analysis = await WebController.newAnalysis(file, name, date);
        setAnalyses(prev => [...prev, analysis]);
    };

    const fetchAnalysisById = useCallback(async (id: number): Promise<Analysis | undefined> => {
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

    const deleteAnalysis = async (analysisId: number) => {
        try {
            await WebController.deleteAnalysis(analysisId);
            setAnalyses(prev => prev.filter(a => a.id !== analysisId));
        } catch (error) {
            console.error('Failed to delete analysis:', error);
        }
    };

    const toggleFavoriteStatus = async (analysisId: number) => {
        try {
            await WebController.toggleFavoriteStatus(analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to update favorite status:', error);
        }
    };

    const addMicroservice = async (data: any, analysisId: number) => {
        try {
            await WebController.newMicroservice(data, analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to add microservice:', error);
        }
    };

    const updateMicroservice = async (data: any, analysisId: number) => {
        try {
            await WebController.updateMicroservice(data, analysisId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to update microservice:', error);
        }
    };

    const deleteMicroservice = async (analysisId: number, microserviceName: string) => {
        try {
            await WebController.deleteMicroservice(analysisId, microserviceName);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to delete microservice:', error);
        }
    }


    const addSmellToMicroservice = async (analysisId: number, microserviceId: string, smellId: number) => {
        try {
            await WebController.addSmellToMicroservice(analysisId, microserviceId, smellId);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to add smell to microservice:', error);
        }
    };

    const getSmellById = useCallback((analysisId: number, smellId: number) => {
        const analysis = analyses.find(a => a.id === analysisId);
        console.log("ciao ddw");
        if (analysis) {
            return analysis.smells.find(s => s.id === smellId);
        }
        return undefined;
    }, [analyses]);

    const addEffortTime = async (analysisId: number, smellId: number, effortTime: EffortTime) => {
        try {
            console.log("Adding effort time:", effortTime);
            await WebController.addEffortTime(analysisId, smellId, effortTime);
            const updatedAnalysis = await WebController.fetchAnalysis(analysisId);
            setAnalyses(prev => prev.map(a => a.id === analysisId ? updatedAnalysis : a));
        } catch (error) {
            console.error('Failed to add effort time:', error);
        }
    };

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
            addEffortTime
        }}>
            {children}
        </AnalysisContext.Provider>
    );
};
