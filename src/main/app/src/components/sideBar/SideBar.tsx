import React, { useEffect, useState } from 'react';
import './SideBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { Microservice } from "../../interfaces/Microservice";
import { SmellStatus, UrgencyCode } from "../../interfaces/Smell";
import { SmellFilter } from "../../interfaces/SmellFilter";

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
const formatSmellStatus = (status: SmellStatus) => {
    return status
        .toLowerCase() // Convert all to lower case
        .replaceAll('_', ' ') // Replace underscores with spaces
        .replace(/\b(\w)/g, char => char.toUpperCase()); // Capitalize the first letter of each word
};

const FilterButton = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button className={active ? "active" : "not-active"} onClick={onClick}>{label}</button>
);

const AccordionSection = ({
                              title,
                              isOpen,
                              onToggle,
                              children,
                              filterCount,
                              onClearFilters
                          }: {
    title: string,
    isOpen: boolean,
    onToggle: () => void,
    children: React.ReactNode,
    filterCount: number,
    onClearFilters: (e: React.MouseEvent) => void
}) => (
    <div className="accordion-item">
        <div className="accordion-title" onClick={onToggle}>
            <FontAwesomeIcon icon={isOpen ? faAngleDown : faAngleRight} className="icon-arrow" />
            <span>{title}</span>
            <div className="filter-controls-right">
                <span className={`filter-counter ${filterCount > 0 ? 'visible' : ''}`}>{filterCount}</span>
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    onClick={onClearFilters}
                    className={`remove-filter-icon ${filterCount > 0 ? 'visible' : ''}`}
                />
            </div>
        </div>
        {isOpen && <div className="accordion-content">{children}</div>}
    </div>
);

const Sidebar: React.FC<SidebarProps> = ({ microservices, filters, updateFilters }) => {
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

    const removeSectionFilters = (filterKey: keyof SmellFilter, e: React.MouseEvent) => {
        e.stopPropagation();
        updateFilters({ ...filters, [filterKey]: [] });
    };

    const toggleUrgencyCode = (code: UrgencyCode | 'undefined') => {
        const newUrgencyCodes = new Set(filters.urgencyCode ?? []);
        if (code === 'undefined') {
            if (newUrgencyCodes.has(undefined)) {
                newUrgencyCodes.delete(undefined);
            } else {
                newUrgencyCodes.add(undefined);
            }
        } else if (newUrgencyCodes.has(code)) {
            newUrgencyCodes.delete(code);
        } else {
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
                <FilterButton
                    label="All smells"
                    active={!filters.isChecked}
                    onClick={() => updateFilters({ ...filters, isChecked: false })}
                />
                <FilterButton
                    label="Checked"
                    active={filters.isChecked as boolean}
                    onClick={() => updateFilters({ ...filters, isChecked: true })}
                />
            </div>
            <div className="filters-header">
                <h2>Filters</h2>
                <button onClick={clearFilters} className={`clear-filters ${hasAnyActiveFilters() ? 'visible' : ''}`}>
                    Clear all
                </button>
            </div>
            <div className="accordion">
                <AccordionSection
                    title="Urgency Code"
                    isOpen={openSections['urgencyCodes']}
                    onToggle={() => toggleSection('urgencyCodes')}
                    filterCount={countActiveFilters('urgencyCode')}
                    onClearFilters={(e) => removeSectionFilters('urgencyCode', e)}
                >
                    {Object.entries(urgencyCodeDescriptions).map(([code, { color, description }]) => (
                        <div
                            key={code}
                            className={`option ${filters.urgencyCode?.includes(code as UrgencyCode) || (code === 'undefined' && filters.urgencyCode?.includes(undefined)) ? 'selected' : 'not-selected'}`}
                            onClick={() => toggleUrgencyCode(code as UrgencyCode)}
                        >
                            <span className={`color-dot ${color}`}></span>
                            <span>{description}</span>
                        </div>
                    ))}
                </AccordionSection>
                <AccordionSection
                    title="Smell Code"
                    isOpen={openSections['smellCodes']}
                    onToggle={() => toggleSection('smellCodes')}
                    filterCount={countActiveFilters('smellCodes')}
                    onClearFilters={(e) => removeSectionFilters('smellCodes', e)}
                >
                    <div className="accordion-content smellCode">
                        {Object.entries(smellCodeDescriptions).map(([code, description]) => (
                            <div
                                key={code}
                                className={`option ${filters.smellCodes?.includes(code) ? 'selected' : 'not-selected'}`}
                                onClick={() => toggleSmellCode(code)}
                            >
                                <span>{description}</span>
                                <span className="smell-code">{code}</span>
                            </div>
                        ))}
                    </div>
                </AccordionSection>
                <AccordionSection
                    title="Microservice"
                    isOpen={openSections['microservice']}
                    onToggle={() => toggleSection('microservice')}
                    filterCount={countActiveFilters('microservice')}
                    onClearFilters={(e) => removeSectionFilters('microservice', e)}
                >
                    {microservices.length > 0 ? (
                        microservices.map(microservice => (
                            <div
                                key={microservice.name}
                                className={`option ${filters.microservice?.includes(microservice.name) ? 'selected' : 'not-selected'}`}
                                onClick={() => toggleMicroservice(microservice.name)}
                            >
                                <span>{microservice.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="no-microservice">No microservices found</div>
                    )}
                </AccordionSection>
                <AccordionSection
                    title="Smell Status"
                    isOpen={openSections['smellStatus']}
                    onToggle={() => toggleSection('smellStatus')}
                    filterCount={countActiveFilters('smellStatus')}
                    onClearFilters={(e) => removeSectionFilters('smellStatus', e)}
                >
                    {Object.values(SmellStatus).map(status => (
                        <div
                            key={status}
                            className={`option ${filters.smellStatus?.includes(status) ? 'selected' : 'not-selected'}`}
                            onClick={() => toggleSmellStatus(status)}
                        >
                            <span>{formatSmellStatus(status)}</span>
                        </div>
                    ))}
                </AccordionSection>
            </div>
        </div>
    );
};

export default Sidebar;
