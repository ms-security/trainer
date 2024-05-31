import React from 'react';
import { Category, QualityAttribute } from "../../interfaces/QualityAttribute";
import { Microservice } from "../../interfaces/Microservice";
import {getRelevanceIndicator} from "../../util/utilityFunctions";

interface MicroserviceSectionProps {
    microservice: Microservice;
}

const MicroserviceSection: React.FC<MicroserviceSectionProps> = ({ microservice }) => {
    return (
        <div className="smellPage-microservice-properties">
            <h3 className="smellPage-propertiesQualityAttributes">{microservice.name}</h3>
            <h4 className="smellPage-microservice-generalRelevance">RELEVANCE
                <span className={`smellPage-relevanceIndicator ${getRelevanceIndicator(microservice.relevance)}`}>
                    {microservice.relevance}
                </span>
            </h4>
            {Object.values(Category).map(category => {
                const filteredQualityAttributes = microservice.qualityAttributes.filter(attr => attr.category === category);
                return filteredQualityAttributes.length > 0 && (
                    <div key={category}>
                        <h4 className="smellPage-propertyCategory">{category}</h4>
                        {filteredQualityAttributes.map(attribute => (
                            <div key={attribute.name} className="smellPage-microservice-property">
                                <span className="smellPage-msAttribute">{attribute.name}</span>
                                <span className={`smellPage-relevanceIndicator ${getRelevanceIndicator(attribute.relevance)}`}>
                                    {attribute.relevance}
                                </span>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default MicroserviceSection;
