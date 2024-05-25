import React, { useRef, useState } from 'react';
import './Upload.css';
// Import icons from Font Awesome for UI elements
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface UploadProps {
    onClose: () => void; // Function to call when closing the upload modal
    onNewAnalysis: (file: File, name: string, date: string, extension: string) => void; // Function to handle a new analysis object
}

// The Upload component allows the user to upload files for analysis
const Upload: React.FC<UploadProps> = ({ onClose, onNewAnalysis }) => {
    // State for managing the selected file
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // State to track if a file is selected
    const [isFilePicked, setIsFilePicked] = useState(false);
    // State for the name of the analysis
    const [analysisName, setAnalysisName] = useState('');

    // Handles changes to the file input field
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            handleFileValidation(files[0]);
        }
    };

    // Handles file drag over the drop area
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent default behavior of opening the file
    };

    // Validates the file extension and selects the file if valid
    const handleFileValidation = (file: File) => {
        // Check the file extension
        const validExtensions = ['.txt', '.json'];
        const fileExtension = file.name.split('.').pop();

        if (fileExtension && validExtensions.includes('.' + fileExtension.toLowerCase())) {
            setSelectedFile(file);
            setIsFilePicked(true);
            setAnalysisName(file.name.replace(/\.[^/.]+$/, "")); // Remove file extension from name
        } else {
            // If the file is not a .txt, display an error message
            alert("Only .txt and .json files are allowed!");
            setIsFilePicked(false);
        }
    };

    // Handles file drop on the drop area
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Prevent default file opening behavior
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileValidation(files[0]); // Validate the first file
        }
    };

    // Handles file upload submission
    // Handles file upload submission
    const handleSubmission = () =>{
        if (selectedFile && analysisName) {
            const currentDate = new Date().toISOString(); // Get the current date
            const fileExtension = selectedFile.name.split('.').pop() || '';
            onNewAnalysis(selectedFile, analysisName, currentDate, fileExtension);
        } else {
            alert('Please select a file and enter a name for the analysis.');
        }
    };


    // Ref for the file input, used to trigger it programmatically
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Function to programmatically click the hidden file input when the upload button is clicked
    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    // Render the upload modal with a drag-and-drop area and a confirm button
    return (
        <div className="modal-overlay active">
            <div className="upload-modal active" onClick={(e) => e.stopPropagation()}>
                <div className="upload-header">
                    <button className="close-button" onClick={onClose}>x</button>
                </div>

                <button onClick={handleFileButtonClick} className="upload-button">
                    <FontAwesomeIcon icon={faFolderOpen} /> Upload from files
                </button>

                <div
                    className="upload-content"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {!isFilePicked ? (
                        <div className="upload-message">
                            Drag and drop your file here or use the button above to select a file.
                        </div>
                    ) : (
                        <div className="file-info">Selected file: {selectedFile!.name}</div>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept=".txt, .json"
                        id="file-input"
                        style={{ display: 'none' }}
                    />
                </div>
                <input
                    type="text"
                    value={analysisName}
                    onChange={(e) => setAnalysisName(e.target.value)}
                    placeholder="Insert analysis name"
                    disabled={!isFilePicked}
                    className="analysis-name-input"
                />
                <button
                    onClick={handleSubmission}
                    disabled={!isFilePicked}
                    className={`confirm-button ${!isFilePicked ? 'disabled' : ''}`}
                >
                    Confirm
                </button>

            </div>
        </div>
    );
};

export default Upload;