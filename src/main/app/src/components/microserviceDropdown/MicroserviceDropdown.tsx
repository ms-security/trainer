import React, {useEffect, useRef, useState} from 'react';
import { Microservice } from "../../interfaces/Microservice";
import './MicroserviceDropdown.css';
import MicroserviceDetailsCard from "../cards/MicroserviceDetailCard";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

interface MicroserviceDropdownProps {
    microservices: Microservice[];
    onSelect: (microservice: Microservice) => void;
    onEditMicroservice: (microservice: Microservice) => void;
    deleteMicroservice: (microserviceId: number) => void;
    filenames: string[];
    onAssignMicroservice: (microserviceId: number, selectedFileNames: string[]) => void;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500, // Set the width of the modal or use a percentage
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3, // Padding inside the modal
};

const MicroserviceDropdown: React.FC<MicroserviceDropdownProps> = ({ microservices, onSelect, onEditMicroservice, deleteMicroservice, filenames, onAssignMicroservice}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMicroservice, setSelectedMicroservice] = useState<Microservice | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isAssignToModalOpen, setIsAssignToModalOpen] = useState(false);
    const [selectedFilenames, setSelectedFilenames] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDropdown = () => {
        setIsOpen(prevIsOpen => {
            if (prevIsOpen) {
                setSelectedMicroservice(null);
            }
            return !prevIsOpen;
        });
    };


    const handleSelect = (microservice: Microservice) => {
        if(selectedMicroservice?.name === microservice.name) {
            setSelectedMicroservice(null);
            return;
        }
        setSelectedMicroservice(microservice)
        onSelect(microservice);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            (!modalRef.current?.contains(event.target as Node))
        ) {
            setIsOpen(false);
            setSelectedMicroservice(null);
        }
    };

    const handleDelete = (microserviceId: number) => {
        deleteMicroservice(microserviceId);
        setSelectedMicroservice(null);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (selectedMicroservice) {
            setSelectedFilenames(filenames.filter(filename => filename.toLowerCase().includes(selectedMicroservice.name.toLowerCase())));
        }
    }, [selectedMicroservice, filenames]);

    const handleConfirm = () => {
        if (selectedMicroservice) {
            onAssignMicroservice(selectedMicroservice.id as number, selectedFilenames);
            setIsOpen(false)
            setSelectedMicroservice(null)
            closeModal();
        }
    };

    const handleFilenameChange = (filename: string) => {
        setSelectedFilenames(prevSelected => {
            if (prevSelected.includes(filename)) {
                return prevSelected.filter(name => name !== filename);
            } else {
                return [...prevSelected, filename];
            }
        });
    };

    const closeModal = () => {
        setIsAssignToModalOpen(false);
    };

    const filteredFilenames = filenames.filter(filename => filename.toLowerCase().includes(searchTerm.toLowerCase()));


    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button className="dropdown-button" onClick={toggleDropdown}>
                Microservices List
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {microservices.length === 0 ? (
                        <div className="dropdown-item no-microservices">No microservices</div>
                    ) : (
                        microservices.map((microservice, index) => (
                            <div
                                key={microservice.name}
                                className={`dropdown-item ${selectedMicroservice?.name === microservice.name ? 'selected' : ''}`}
                                onClick={() => handleSelect(microservice)}
                            >
                                {microservice.name}
                            </div>
                        ))
                    )}
                </div>
            )}
            {selectedMicroservice && (
                <div className="microservice-details-container">
                    <MicroserviceDetailsCard
                        microservice={selectedMicroservice}
                        onEditMicroservice={onEditMicroservice}
                        deleteMicroservice={handleDelete}
                        onAssignToClick={() => setIsAssignToModalOpen(true)}
                    />
                </div>
            )}
            <div ref={modalRef}>
                <Modal
                    open={isAssignToModalOpen}
                    onClose={closeModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style} ref={modalRef}>
                        <h2 className="modal-title">Assign the microservice to the smells related to these files:</h2>
                        <input
                            type="text"
                            placeholder="Search filenames..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-bar"
                        />
                        <div className="filenames-list">
                            {filteredFilenames.length > 0 ? (
                                filteredFilenames.map((filename, index) => (
                                    <div key={filename} className="filename-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value={filename}
                                                checked={selectedFilenames.includes(filename)}
                                                onChange={() => handleFilenameChange(filename)}
                                            />
                                            {filename}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">No results found</div>
                            )}
                        </div>
                        <button className="confirm-button-assign-to" onClick={handleConfirm}>Confirm</button>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default MicroserviceDropdown;
