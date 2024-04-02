// FileUpload.tsx
import React, { useState } from 'react';
import './Upload.css'; // Crea e importa il tuo CSS qui

const FileUpload: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (event.dataTransfer.files) {
            setSelectedFile(event.dataTransfer.files[0]);
        }
    };

    return (
        <div
            onDrop={handleFileDrop}
            onDragOver={(event) => event.preventDefault()}
            className="file-drop-area"
        >
            <input
                type="file"
                onChange={handleFileChange}
                accept=".txt"
                style={{ display: 'none' }}
                id="file-input"
            />
            <label htmlFor="file-input" className="upload-label">
                Trascina qui il tuo file .txt o clicca per selezionarlo
            </label>
            {selectedFile && <div>File selezionato: {selectedFile.name}</div>}
        </div>
    );
}

export default FileUpload;
