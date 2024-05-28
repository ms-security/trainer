import {Analysis} from "../interfaces/Analysis";
import {Microservice} from "../interfaces/Microservice";
import {EffortTime} from "../interfaces/EffortTime";
import {Smell} from "../interfaces/Smell";

export default class WebController{
    static async newAnalysis(file: File, name: string, date: string, extension: string) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        formData.append("date", date);
        formData.append("extension", extension);
        const response = await fetch('http://localhost:8080/analysis', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to add new analysis');
        }
    }

    static async fetchAllAnalyses(): Promise<Analysis[]> {
        const response = await fetch('http://localhost:8080/analysis', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch analyses from the server');
        }
        const analyses: Analysis[] = await response.json();
        return analyses;
    }

    static async fetchAnalysis(analysisId: string): Promise<Analysis> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch analysis from the server');
        }
        const analysis: Analysis = await response.json();
        return analysis;
    }

    static async deleteAnalysis(analysisId: string) {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to delete analysis');
        }
    }

    static async toggleFavoriteStatus(analysisId: string): Promise<void> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}/favorite`, {
            method: 'PUT'
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to update favorite status');
        }
    }

    static async newMicroservice(data: any, analysisId: string): Promise<Microservice> {
        const response = await fetch(`http://localhost:8080/microservices/${analysisId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const microservice: Microservice = await response.json();
            return microservice;
        } else {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to add microservice');
        }
    }

    static async updateMicroservice(data: any, analysisId: string) {
        const response = await fetch(`http://localhost:8080/microservices/${analysisId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to update microservice');
        }
    }

    static async deleteMicroservice(analysisId: string, microserviceId: number) {
        const response = await fetch(`http://localhost:8080/microservices/${analysisId}/${microserviceId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to delete microservice');
        }
    }

    static async addSmellToMicroservice(analysisId: string, microserviceId: number, smellId: number): Promise<void> {
        const response = await fetch(`http://localhost:8080/microservices/${analysisId}/${microserviceId}/${smellId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to add microservice to smell');
        }
    }

    static async multipleMicroserviceAssignment(analysisId: string, microserviceId: number, smellIds: number[]): Promise<void> {
        const response = await fetch(`http://localhost:8080/microservices/${analysisId}/${microserviceId}/smells`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(smellIds)
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to assign microservice to multiple smells');
        }
    }

    static async addEffortTime(analysisId: string, smellId: number, effortTime: EffortTime): Promise<void> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}/smell/${smellId}/effortTime`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(effortTime)
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to add effort time');
        }
    }

    static async changeCheckboxValue(analysisId: string, smellId: number, checkboxValue: boolean): Promise<void> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}/smell/${smellId}/checkbox`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(checkboxValue)
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to change checkbox value');
        }
    }

    static async changeSmellStatus(analysisId: string, smellId: number, newStatus: string): Promise<void> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}/smell/${smellId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStatus)
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to change smell status');
        }
    }

    static async fetchSmellById(analysisId: string, smellId: number): Promise<Smell> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}/smell/${smellId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch smell from the server');
        }
        const smell: Smell = await response.json();
        return smell;
    }

}