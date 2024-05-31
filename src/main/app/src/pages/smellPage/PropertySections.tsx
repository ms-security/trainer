import React from 'react';
import { Category, QualityAttribute } from "../../interfaces/QualityAttribute";
import { Smell } from "../../interfaces/Smell";

interface PropertySectionsProps {
    smell: Smell | undefined;
}

const PropertySections: React.FC<PropertySectionsProps> = ({ smell }) => {
    if (!smell?.refactoring) return null;
    return (
        <>
            <div className="smellPage-smellImpact">
                <h3 className="smellPage-propertiesSmellImpact">Smell Impact</h3>
                {Object.values(Category).map(category => {
                    const filteredAttributes = smell.propertiesAffected.filter(attr => attr.category === category);
                    if (filteredAttributes.length > 0) {
                        return (
                            <div key={category}>
                                <h4 className="smellPage-propertyCategory">{category}</h4>
                                {filteredAttributes.map(attribute => (
                                    <div key={attribute.name} className="smellPage-property">
                                        <span className={`smellPage-impactIndicator ${attribute.impactsPositively ? 'positive' : 'negative'}`}>
                                            {attribute.impactsPositively ? '+' : '-'}
                                        </span>
                                        <span className="smellPage-propertyName">{attribute.name}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <div className="smellPage-refactoringImpact">
                <h3 className="smellPage-propertiesRefactoringImpact">Refactoring Impact</h3>
                {Object.values(Category).map(category => {
                    const filteredRefactoringAttributes = smell.refactoring.propertiesAffected.filter(attr => attr.category === category);
                    if (filteredRefactoringAttributes.length > 0) {
                        return (
                            <div key={category}>
                                <h4 className="smellPage-propertyCategory">{category}</h4>
                                {filteredRefactoringAttributes.map(attribute => (
                                    <div key={attribute.name} className="smellPage-property">
                                        <span className={`smellPage-impactIndicator ${attribute.impactsPositively ? 'positive' : 'negative'}`}>
                                            {attribute.impactsPositively ? '+' : '-'}
                                        </span>
                                        <span className="smellPage-propertyName">{attribute.name}</span>
                                    </div>
                                ))}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </>
    );
};

export default PropertySections;
