import React, {useState} from 'react';
import './SideBar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faArrowLeft, faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import {Microservice} from "../../interfaces/Microservice";

interface SidebarProps {
    isVisible: boolean;
    toggleSidebar: () => void;
    microservices: Microservice[];
    onClickModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, toggleSidebar, microservices, onClickModal}) => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const renderMicroservices = () => {
        if (microservices.length === 0) {
            return <div>No microservices available.</div>;
        }
        return microservices.map(ms => (
            <div key={ms.name} className="microservice">
                <div className="microservice-name">Name: {ms.name}</div>
                <div className="microservice-relevance">Relevance: {ms.relevance}</div>
                <div className="quality-attributes">
                    {ms.qualityAttributes.filter(qa => qa.relevance !== "NONE").map(qa => (
                        <div key={qa.name} className="quality-attribute">
                            <div className="quality-attribute-name">Attribute: {qa.name}</div>
                            <div className="quality-attribute-relevance">Relevance: {qa.relevance}</div>
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div className={`sidebar-wrapper ${!isVisible ? 'hidden' : ''}`}>
            <div className="sidebar">
                <div className="accordion">
                    <div className="accordion-item">
                        <div className="accordion-title" onClick={() => toggleSection('filters')}>
                            <span>Filters</span>
                            <FontAwesomeIcon icon={openSections.filters ? faAngleDown : faAngleRight} />
                        </div>
                        {openSections.filters && <div className="accordion-content">Content for Filters</div>}
                    </div>
                    <div className="accordion-item">
                        <div className="accordion-title" onClick={() => toggleSection('microservices')}>
                            <span>Microservices</span>
                            <FontAwesomeIcon icon={openSections.microservices ? faAngleDown : faAngleRight} />
                        </div>
                        {openSections.microservices &&
                            <div className="accordion-content">
                                {renderMicroservices()}
                                <button onClick={onClickModal}>Add Microservice</button>
                            </div>}
                    </div>
                    <div className="accordion-item">
                        <div className="accordion-title" onClick={() => toggleSection('smells')}>
                            <span>Smells</span>
                            <FontAwesomeIcon icon={openSections.smells ? faAngleDown : faAngleRight} />
                        </div>
                        {openSections.smells && <div className="accordion-content">Content for Smells</div>}
                    </div>
                </div>
            </div>
            <button onClick={toggleSidebar} className="toggle-button">
                <FontAwesomeIcon icon={faArrowLeft} className={`arrow-icon ${!isVisible ? 'flipped' : ''}`} />
            </button>
        </div>
    );
};

export default Sidebar;
