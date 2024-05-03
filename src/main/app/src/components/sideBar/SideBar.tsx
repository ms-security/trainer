import React, { useState } from 'react';
import './SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDown, faAngleRight, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { Microservice } from "../../interfaces/Microservice";
import { UrgencyCode } from "../../interfaces/Smell";
import { useAnalysis } from "../../contexts/AnalysisContext";
import {SmellFilter} from "../../interfaces/SmellFilter";

interface SidebarProps {
    microservices: Microservice[];
}

const urgencyCodeDescriptions: Record<UrgencyCode | 'undefined', { color: string, description: string }> = {
    H: { color: "dark-red", description: "High" },
    h: { color: "light-coral", description: "Medium to High" },
    M: { color: "orange", description: "Medium" },
    m: { color: "yellow", description: "Low to Medium" },
    L: { color: "yellow-green", description: "Low" },
    l: { color: "light-green", description: "None to Low" },
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
    NDE: "Non-Encrypted Data Exposure",
    PAM: "Publicly Accessible Microservices"
};

const Sidebar: React.FC<SidebarProps> = ({ microservices }) => {
    const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});
    const { filters, setFilters } = useAnalysis();

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

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
                        <div className="accordion-content urgency">
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
                        <div className="accordion-content smell">
                            {Object.entries(smellCodeDescriptions).map(([code, description]) => (
                                <div key={code} className={`option ${filters.smellCodes?.includes(code) ? 'selected' : ''}`} onClick={() => toggleSmellCode(code)}>
                                    <span>{description} ({code})</span>
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
