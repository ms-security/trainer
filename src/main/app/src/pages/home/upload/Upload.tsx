// Upload.tsx

import React, {useRef, useState} from 'react';
import './Upload.css';

interface UploadProps {
    onClose: () => void; // Aggiungi la prop 'onClose'
}

const Upload: React.FC<UploadProps> = ({ onClose }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isFilePicked, setIsFilePicked] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            setSelectedFile(event.target.files[0]);
            setIsFilePicked(true);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
        setIsFilePicked(true);
    };

    const handleSubmission = () => {
        // Logica di invio del file
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
