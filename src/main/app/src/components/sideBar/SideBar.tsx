import React, {useEffect, useState} from 'react';
import './SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDown, faAngleRight, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { Microservice } from "../../interfaces/Microservice";
import {SmellStatus, UrgencyCode } from "../../interfaces/Smell";
import { useAnalysis } from "../../contexts/AnalysisContext";
import {SmellFilter} from "../../interfaces/SmellFilter";

interface SidebarProps {
    microservices: Microservice[];
}

const urgencyCodeDescriptions: Record<UrgencyCode | 'undefined', { color: string, description: string }> = {
    HH: { color: "dark-red", description: "High" },
    H: { color: "light-coral", description: "Medium to High" },
    MM: { color: "orange", description: "Medium" },
    M: { color: "yellow", description: "Low to Medium" },
    LL: { color: "yellow-green", description: "Low" },
    L: { color: "light-green", description: "None to Low" },
    Ø: { color: "darkgreen", description: "None" },
    undefined: { color: "gray", description: "Undefined" }
};

const smellCodeDescriptions: Record<string, string> = {
    UPM: "Unnecessary Privileges to Microservices",
    HS: "Hardcoded Secrets",
    NSC: "Non-Secured Service-to-Service Communications",
    OCC: "Own Crypto Code",
    IAC: "Insufficient Access Control",
    CA: "Centralized Authorization",
    MUA: "Multiple User Authentication",
    UT: "Unauthenticated Traffic",
    NEDE: "Non-Encrypted Data Exposure",
    PAM: "Publicly Accessible Microservices"
};

// Helper function to format the SmellStatus enum values into a more readable format
const formatSmellStatus = (status : SmellStatus) => {
    return status
        .toLowerCase() // Convert all to lower case
        .replaceAll('_', ' ') // Replace underscores with spaces
        .replace(/\b(\w)/g, char => char.toUpperCase()); // Capitalize the first letter of each word
};

const Sidebar: React.FC<SidebarProps> = ({ microservices }) => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ urgencyCodes: true });
    const { filters, setFilters } = useAnalysis();

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        // Assicurarsi che i filtri dei microservizi rimangano validi anche quando i microservizi cambiano
        const currentMicroserviceNames = new Set(microservices.map(m => m.name));
        const validMicroservices = (filters.microservice || []).filter(name => currentMicroserviceNames.has(name));
        if (validMicroservices.length !== (filters.microservice || []).length) {
            setFilters({ ...filters, microservice: validMicroservices });
        }
    }, [microservices, filters, setFilters]);

    const countActiveFilters = (filterKey: keyof SmellFilter): number => {
        const filterArray = filters[filterKey];
        return Array.isArray(filterArray) ? filterArray.length : 0;
    };


    const removeSectionFilters = (filterKey: keyof SmellFilter) => {
        setFilters({
            ...filters,
            [filterKey]: []
        });
    };

    const toggleUrgencyCode = (code: UrgencyCode | 'undefined') => {
        const newUrgencyCodes = new Set(filters.urgencyCode || []);
        if (code === 'undefined') {
            if (newUrgencyCodes.has(undefined)) {
                newUrgencyCodes.delete(undefined);
            } else {
                newUrgencyCodes.add(undefined);
            }
        }
        else if (newUrgencyCodes.has(code)){
            newUrgencyCodes.delete(code);
        }
        else {
            newUrgencyCodes.add(code);
        }
        setFilters({ ...filters, urgencyCode: Array.from(newUrgencyCodes) });
    };

    const toggleSmellCode = (code: string) => {
        const newSmellCodes = new Set(filters.smellCodes || []);
        if (newSmellCodes.has(code)) {
            newSmellCodes.delete(code);
        } else {
            newSmellCodes.add(code);
        }
        setFilters({ ...filters, smellCodes: Array.from(newSmellCodes) });
    };

    const clearFilters = () => {
        setFilters({
            ...filters,
            isChecked: filters.isChecked !== undefined ? filters.isChecked : false,
            smellStatus: [],
            urgencyCode: [],
            microservice: [],
            smellCodes: []
        });
    };

    const hasAnyActiveFilters = (): boolean => {
        return Object.keys(filters).some(key => {
            const value = filters[key as keyof SmellFilter];
            return Array.isArray(value) && value.length > 0;
        });
    };

    const toggleMicroservice = (microserviceName: string) => {
        const newMicroservices = new Set(filters.microservice || []);
        if (newMicroservices.has(microserviceName)) {
            newMicroservices.delete(microserviceName);
        } else {
            newMicroservices.add(microserviceName);
        }
        setFilters({ ...filters, microservice: Array.from(newMicroservices) });
    };

    const toggleSmellStatus = (status: SmellStatus) => {
        const newSmellStatus = new Set(filters.smellStatus || []);
        if (newSmellStatus.has(status)) {
            newSmellStatus.delete(status);
        } else {
            newSmellStatus.add(status);
        }
        setFilters({ ...filters, smellStatus: Array.from(newSmellStatus) });
    };


    return (
        <div className="sidebar-wrapper">
            <div className="filter-controls">
                <button className={!filters.isChecked ? "active" : ""} onClick={() => setFilters({ ...filters, isChecked: false })}>All smells</button>
                <button className={filters.isChecked ? "active" : ""} onClick={() => setFilters({ ...filters, isChecked: true })}>Checked</button>
            </div>
            <div className="filters-header">
                <h2>Filters</h2>
                <button onClick={clearFilters} className={`clear-filters ${hasAnyActiveFilters() ? 'visible' : ''}`}>Clear all</button>
            </div>
            <div className="accordion">
                <div className="accordion-item">
                    <div className="accordion-title" onClick={() => toggleSection('urgencyCodes')}>
                        <FontAwesomeIcon icon={openSections['urgencyCodes'] ? faAngleDown : faAngleRight} className="icon-arrow" />
                        <span>Urgency Code</span>
                        <div className="filter-controls-right">
                            <span className={`filter-counter ${countActiveFilters('urgencyCode') > 0 ? 'visible' : ''}`}>
                                {countActiveFilters('urgencyCode')}
                            </span>
                            <FontAwesomeIcon icon={faTimesCircle} onClick={(e) => {
                                e.stopPropagation();  // Impedisce il clic dall'attivazione del toggleSection
                                removeSectionFilters('urgencyCode');
                            }} className={`remove-filter-icon ${countActiveFilters('urgencyCode') > 0 ? 'visible' : ''}`} />
                        </div>
                    </div>
                    {openSections['urgencyCodes'] && (
                        <div className="accordion-content">
                            {Object.entries(urgencyCodeDescriptions).map(([code, { color, description }]) => (
                                <div key={code} className={`option ${filters.urgencyCode?.includes(code as UrgencyCode) || (code === 'undefined' && filters.urgencyCode?.includes(undefined)) ? 'selected' : ''}`} onClick={() => toggleUrgencyCode(code as UrgencyCode)}>
                                    <span className={`color-dot ${color}`}></span>
                                    <span>{description}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Sezione Smell Code */}
                <div className="accordion-item">
                    <div className="accordion-title" onClick={() => toggleSection('smellCodes')}>
                        <FontAwesomeIcon icon={openSections['smellCodes'] ? faAngleDown : faAngleRight} className="icon-arrow" />
                        <span>Smell Code</span>
                        <div className="filter-controls-right">
                        <span className={`filter-counter ${countActiveFilters('smellCodes') > 0 ? 'visible' : ''}`}>
                            {countActiveFilters('smellCodes')}
                        </span>
                            <FontAwesomeIcon icon={faTimesCircle} onClick={(e) => {
                                e.stopPropagation();
                                removeSectionFilters('smellCodes');
                            }} className={`remove-filter-icon ${countActiveFilters('smellCodes') > 0 ? 'visible' : ''}`} />
                        </div>
                    </div>
                    {openSections['smellCodes'] && (
                        <div className="accordion-content smellCode">
                            {Object.entries(smellCodeDescriptions).map(([code, description]) => (
                                <div key={code} className={`option ${filters.smellCodes?.includes(code) ? 'selected' : ''}`} onClick={() => toggleSmellCode(code)}>
                                    <span>{description}</span>
                                    <span>({code})</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Sezione Microservice*/}
                <div className="accordion-item">
                    <div className="accordion-title" onClick={() => toggleSection('microservice')}>
                        <FontAwesomeIcon icon={openSections['microservice'] ? faAngleDown : faAngleRight} className="icon-arrow" />
                        <span>Microservice</span>
                        <div className="filter-controls-right">
                        <span className={`filter-counter ${countActiveFilters('microservice') > 0 ? 'visible' : ''}`}>
                            {countActiveFilters('microservice')}
                        </span>
                            <FontAwesomeIcon icon={faTimesCircle} onClick={(e) => {
                                e.stopPropagation();
                                removeSectionFilters('microservice');
                            }} className={`remove-filter-icon ${countActiveFilters('microservice') > 0 ? 'visible' : ''}`} />
                        </div>
                    </div>
                    {openSections['microservice'] && (
                        <div className="accordion-content smellCode">
                            {microservices.length > 0 ? (
                                microservices.map(microservice => (
                                    <div key={microservice.name} className={`option ${filters.microservice?.includes(microservice.name) ? 'selected' : ''}`} onClick={() => toggleMicroservice(microservice.name)}>
                                        <span>{microservice.name}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="no-microservice">No microservices found</div>
                            )}
                        </div>
                    )}
                </div>
                {/* Sezione Status*/}
                <div className="accordion-item">
                    <div className="accordion-title" onClick={() => toggleSection('smellStatus')}>
                        <FontAwesomeIcon icon={openSections['smellStatus'] ? faAngleDown : faAngleRight} className="icon-arrow" />
                        <span>Smell Status</span>
                        <div className="filter-controls-right">
                        <span className={`filter-counter ${countActiveFilters('smellStatus') > 0 ? 'visible' : ''}`}>
                            {countActiveFilters('smellStatus')}
                        </span>
                            <FontAwesomeIcon icon={faTimesCircle} onClick={(e) => {
                                e.stopPropagation();
                                removeSectionFilters('smellStatus');
                            }} className={`remove-filter-icon ${countActiveFilters('smellStatus') > 0 ? 'visible' : ''}`} />
                        </div>
                    </div>
                    {openSections['smellStatus'] && (
                        <div className="accordion-content smellStatus"> {/* Aggiunto smellStatus come classe */}
                            {Object.values(SmellStatus).map(status => (
                                <div
                                    key={status}
                                    className={`option ${filters.smellStatus?.includes(status) ? 'selected' : ''}`}
                                    onClick={() => toggleSmellStatus(status)}
                                >
                                    <span>{formatSmellStatus(status)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
