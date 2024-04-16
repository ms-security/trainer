import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import WebController from '../application/WebController';
import { Analysis } from "../interfaces/Analysis";

interface AnalysisContextType {
    analyses: Analysis[];
    fetchAnalyses: () => Promise<void>;
    fetchAnalysisById: (id: number) => Promise<Analysis | undefined>;
    addAnalysis: (file: File, name: string, date: string) => Promise<void>;
    deleteAnalysis: (analysisId: number) => Promise<void>;
    toggleFavoriteStatus: (analysisId: number) => Promise<void>;
    addMicroservice: (data: any, analysisId: number) => Promise<void>;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
    const context = useContext(AnalysisContext);
    if (!context) throw new Error('useAnalysis must be used within an AnalysisProvider');
    return context;
};

export const AnalysisProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [analyses, setAnalyses] = useState<Analysis[]>([]);

    const fetchAnalyses = useCallback(async () => {
        try {
            const data = await WebController.fetchAllAnalyses();
            setAnalyses(data);
        } catch (error) {
            console.error('Failed to fetch analyses:', error);
        }
    }, []);

    const addAnalysis = async (file: File, name: string, date: string) => {
        try {
            const analysis = await WebController.newAnalysis(file, name, date);
            setAnalyses(prev => [...prev, analysis]);
        } catch (error) {
            if(error instanceof Error)
                alert(error.message || 'An error occurred while uploading the file.');
        }
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
            toggleFavoriteStatus,
            addMicroservice
        }}>
            {children}
        </AnalysisContext.Provider>
    );
};
