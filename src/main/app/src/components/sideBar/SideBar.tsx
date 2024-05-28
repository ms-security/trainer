import React, {useEffect, useState} from 'react';
import './SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDown, faAngleRight, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { Microservice } from "../../interfaces/Microservice";
import {SmellStatus, UrgencyCode } from "../../interfaces/Smell";
import {SmellFilter} from "../../interfaces/SmellFilter";


interface SidebarProps {
    microservices: Microservice[];
    filters: SmellFilter;
    updateFilters: (filters: Partial<SmellFilter>) => void;
}

const urgencyCodeDescriptions: Record<UrgencyCode | 'undefined', { color: string, description: string }> = {
    HH: { color: "dark-red", description: "High" },
    HM: { color: "light-coral", description: "Medium to High" },
    MM: { color: "orange", description: "Medium" },
    ML: { color: "yellow", description: "Low to Medium" },
    LL: { color: "yellow-green", description: "Low" },
    LN: { color: "light-green", description: "None to Low" },
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

const Sidebar: React.FC<SidebarProps> = ({ microservices,filters,updateFilters }) => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({ urgencyCodes: true });

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    useEffect(() => {
        const currentMicroserviceNames = new Set(microservices.map(m => m.name));
        const validMicroservices = (filters.microservice ?? []).filter(name => currentMicroserviceNames.has(name));
        if (validMicroservices.length !== (filters.microservice || []).length) {
            updateFilters({ ...filters, microservice: validMicroservices });
        }
    }, [microservices, filters, updateFilters]);

    const countActiveFilters = (filterKey: keyof SmellFilter): number => {
        const filterArray = filters[filterKey];
        return Array.isArray(filterArray) ? filterArray.length : 0;
    };


    const removeSectionFilters = (filterKey: keyof SmellFilter) => {
        updateFilters({
            ...filters,
            [filterKey]: []
        });
    };

    const toggleUrgencyCode = (code: UrgencyCode | 'undefined') => {
        const newUrgencyCodes = new Set(filters.urgencyCode ?? []);
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
        updateFilters({ ...filters, urgencyCode: Array.from(newUrgencyCodes) });
    };

    const toggleSmellCode = (code: string) => {
        const newSmellCodes = new Set(filters.smellCodes ?? []);
        if (newSmellCodes.has(code)) {
            newSmellCodes.delete(code);
        } else {
            newSmellCodes.add(code);
        }
        updateFilters({ ...filters, smellCodes: Array.from(newSmellCodes) });
    };

    const clearFilters = () => {
        updateFilters({
            ...filters,
            isChecked: filters.isChecked ?? false,
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
        const newMicroservices = new Set(filters.microservice ?? []);
        if (newMicroservices.has(microserviceName)) {
            newMicroservices.delete(microserviceName);
        } else {
            newMicroservices.add(microserviceName);
        }
        updateFilters({ ...filters, microservice: Array.from(newMicroservices) });
    };

    const toggleSmellStatus = (status: SmellStatus) => {
        const newSmellStatus = new Set(filters.smellStatus ?? []);
        if (newSmellStatus.has(status)) {
            newSmellStatus.delete(status);
        } else {
            newSmellStatus.add(status);
        }
        updateFilters({ ...filters, smellStatus: Array.from(newSmellStatus) });
    };


    return (
        <div className="sidebar-wrapper">
            <div className="filter-controls">
                <button className={!filters.isChecked ? "active" : "not-active"} onClick={() => updateFilters({ ...filters, isChecked: false })}>All smells</button>
                <button className={filters.isChecked ? "active" : "not-active   "} onClick={() => updateFilters({ ...filters, isChecked: true })}>Checked</button>
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
                                <div key={code} className={`option ${filters.urgencyCode?.includes(code as UrgencyCode) || (code === 'undefined' && filters.urgencyCode?.includes(undefined)) ? 'selected' : 'not-selected'}`} onClick={() => toggleUrgencyCode(code as UrgencyCode)}>
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
                                <div key={code} className={`option ${filters.smellCodes?.includes(code) ? 'selected' : 'not-selected'}`} onClick={() => toggleSmellCode(code)}>
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
                                    <div key={microservice.name} className={`option ${filters.microservice?.includes(microservice.name) ? 'selected' : 'not-selected'}`} onClick={() => toggleMicroservice(microservice.name)}>
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
                                    className={`option ${filters.smellStatus?.includes(status) ? 'selected' : 'not-selected'}`}
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
