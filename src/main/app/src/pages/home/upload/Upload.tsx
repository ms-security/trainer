    // Upload.tsx

    import React, {useRef, useState} from 'react';
    import './Upload.css';
    import {Analysis} from "../../../interfaces/Analysis";

    interface UploadProps {
        onClose: () => void; // Aggiungi la prop 'onClose'
        onNewAnalysis: (analysis: Analysis) => void;
    }

    const Upload: React.FC<UploadProps> = ({ onClose, onNewAnalysis }) => {
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [isFilePicked, setIsFilePicked] = useState(false);

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files) {
                handleFileValidation(files[0]);
            }
        };

        const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
        };

        const handleFileValidation = (file: File) => {
            // Controlla l'estensione del file
            const validExtensions = ['.txt'];
            const fileExtension = file.name.split('.').pop();

            if (fileExtension && validExtensions.includes('.' + fileExtension.toLowerCase())) {
                setSelectedFile(file);
                setIsFilePicked(true);
            } else {
                // Se il file non è un .txt, mostriamo un messaggio di errore
                alert("Sono permessi solo file .txt!");
                setIsFilePicked(false);
            }
        };



        const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const files = event.dataTransfer.files;
            if (files && files.length > 0) {
                handleFileValidation(files[0]);
            }
        };

        const handleSubmission = () => {
            if (selectedFile) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const text = e.target?.result;

                    try {
                        const response = await fetch('/analysis', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ content: text }),
                        });

                        if (response.ok) {
                            console.log('File inviato correttamente');
                            console.log("Contenuto del file:", text);
                            const analysis = await response.json();
                            console.log("Analisi ricevuta:", analysis);
                            onNewAnalysis(analysis);
                            onClose(); // Chiude il componente di upload dopo l'invio
                        } else {
                            console.error('Errore nell\'invio del file');
                        }
                    } catch (error) {
                        console.error('Errore di rete o nel server:', error);
                    }
                };
                reader.readAsText(selectedFile);
            }
        };


        const fileInputRef = useRef<HTMLInputElement>(null);

        const handleFileButtonClick = () => {
            fileInputRef.current?.click();
        };

        return (
            <div className="modal-overlay active">
                <div className="upload-modal active" onClick={(e) => e.stopPropagation()}>
                    <div className="upload-header">
                        <button className="close-button" onClick={onClose}>x</button>
                    </div>
                    <div className="upload-content"
                         onDrop={handleDrop}
                         onDragOver={handleDragOver}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            accept=".txt"
                            id="file-input"
                            style={{ display: 'none' }}
                        />
                        <div className="file-drop-label" onClick={handleFileButtonClick}>
                            Trascina qui il tuo file .txt o clicca per selezionarlo
                        </div>
                        {selectedFile && <div className="file-info">File selezionato: {selectedFile.name}</div>}
                        <button
                            onClick={handleSubmission}
                            disabled={!isFilePicked}
                            className={`confirm-button ${!isFilePicked ? 'disabled' : ''}`}
                        >
                            Conferma
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    export default Upload;
