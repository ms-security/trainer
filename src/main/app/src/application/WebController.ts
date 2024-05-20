import {Analysis} from "../interfaces/Analysis";
import {Microservice} from "../interfaces/Microservice";
import {EffortTime} from "../interfaces/EffortTime";
import {Smell} from "../interfaces/Smell";

export default class WebController{
    static async newAnalysis(file: File, name: string, date: string, extension: string): Promise<Analysis> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("name", name);
        formData.append("date", date);
        formData.append("extension", extension);
        const response = await fetch('http://localhost:8080/analysis', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            const analysis: Analysis = await response.json();
            console.log('File sent successfully');
            console.log("Analysis received:", analysis);
            return analysis;
        } else {
            // Handle different errors based on the response
            const errorData = await response.json();
            switch (errorData.id) {
                case -1:
                    throw new Error("The file is empty!");
                    case -2:
                        throw new Error("The file content is not valid!");
                    default:
                        throw new Error("An unknown error occurred.");
                }
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
            throw new Error('Failed to fetch analyses from the server');
        }
        // Parse the JSON response and return it
        const analyses: Analysis[] = await response.json();
        console.log('Analyses fetched successfully:', analyses);
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
            throw new Error('Failed to fetch analysis from the server');
        }
        const analysis: Analysis = await response.json();
        return analysis;
    }

    static async deleteAnalysis(analysisId: string) {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            // Handle failure
            throw new Error('Failed to delete analysis');
        }
    }

    static async toggleFavoriteStatus(analysisId: string): Promise<void> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}/favorite`, {
            method: 'PUT'
        });
        console.log('Favorite status updated');
        if (!response.ok) {
            throw new Error('Failed to update favorite status');
        }
    }

    static async newMicroservice(data: any, analysisId: string): Promise<Microservice> {
        console.log('Adding microservice:', data, analysisId)
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
            const errorData = await response.json();
            throw new Error('Failed to add microservice: ' + errorData.message);
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
            throw new Error('Failed to update microservice');
        }
        console.log('Microservice updated');
    }

    static async deleteMicroservice(analysisId: string, microserviceName: string) {
        const response = await fetch(`http://localhost:8080/microservices/${analysisId}/${microserviceName}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete microservice');
        }
        console.log('Microservice deleted');
    }

    static async addSmellToMicroservice(analysisId: string, microserviceId: string, smellId: number): Promise<void> {
        const response = await fetch(`http://localhost:8080/microservices/${analysisId}/${microserviceId}/${smellId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to add microservice to smell');
        }
        console.log('Microservice added to smell');
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
            throw new Error('Failed to add effort time');
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
            throw new Error('Failed to change checkbox value');
        }
        console.log('Checkbox value changed successfully');
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
            throw new Error('Failed to change smell status');
        }
        console.log('Smell status changed successfully');
    }

    static async fetchSmellById(analysisId: string, smellId: number): Promise<Smell> {
        const response = await fetch(`http://localhost:8080/analysis/${analysisId}/smell/${smellId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch smell from the server');
        }
        const smell: Smell = await response.json();
        return smell;
    }

}