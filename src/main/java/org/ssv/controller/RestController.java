package org.ssv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.database.*;
import org.ssv.database.jpaRepositories.AnalysisRepositoryJpa;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.*;
import org.ssv.service.AnalysisRepository;
import org.ssv.service.AnalysisService;
import org.ssv.service.FactoryAnalysis;
import org.ssv.service.TriageService;
import org.ssv.service.util.ContentParser;
import org.ssv.service.util.TxtContentParser;

import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    //private static AnalysisRepository analysisRepository;

    private AnalysisService analysisService;


    @PostMapping("/analysis")
    public ResponseEntity<Analysis> analysis(@RequestParam("file") MultipartFile file,
                                             @RequestParam("name") String name,
                                             @RequestParam("date") String date) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Analysis.builder().id("-1").build());
        }
        try{
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            ContentParser parser = new TxtContentParser();
            Analysis analysis = FactoryAnalysis.getInstance().createAnalysis(name, date);
            List<Smell> smells = parser.parseContent(content, analysis);
            analysis.setSmells(smells);

            //analysisRepository = AnalysisRepository.getInstance();
            //analysisRepository.insertAnalysis(analysis); // persistent db
            analysisService = new AnalysisService();
            try{
                analysisService.saveAnalysis(analysis); // persistent db
            } catch (Exception e){
                System.out.println("Controller : Error saving analysis: " + e.getMessage());
            }


            //AnalysisDatabaseSingleton.getInstance().addAnalysis(analysis); //hashmap
            //AnalysisDaoImpl.getInstance().insert(analysis); // persistent db

            return ResponseEntity.ok().body(analysis);   //return the analysis with list of smell
        } catch (InvalidContentException e){
            return ResponseEntity.badRequest().body(Analysis.builder().id("-2").build());
        } catch (Exception e){
            return ResponseEntity.badRequest().body(Analysis.builder().id("-3").build());
        }
    }

    @GetMapping("/analysis")
    public ResponseEntity<ArrayList<Analysis>> analysis() throws SQLException {
        System.out.println("fetching analyses");
        return ResponseEntity.ok().body((ArrayList<Analysis>) AnalysisDaoImpl.getInstance().findAll());
        //return ResponseEntity.ok().body((ArrayList<Analysis>) AnalysisDatabaseSingleton.getInstance().getAllAnalyses());
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<Analysis> getAnalysis(@PathVariable String analysisId) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if(analysis != null) {
            return ResponseEntity.ok().body(analysis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable String analysisId) throws SQLException {
        //boolean isRemoved = AnalysisDatabaseSingleton.getInstance().removeAnalysis(analysisId);
        boolean isRemovedDb = AnalysisDaoImpl.getInstance().delete(String.valueOf(analysisId));
        System.out.println("analysis removed " + isRemovedDb);
        if(isRemovedDb) {
            System.out.println("analysis removed");
            return ResponseEntity.ok().build();
        } else {
            System.out.println("analysis NOT removed");
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/analysis/{analysisId}/favorite")
    public ResponseEntity<Analysis> favoriteAnalysis(@PathVariable String analysisId) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if(analysis != null) {
            analysis.setFavorite(!analysis.isFavorite());
            return ResponseEntity.ok().body(analysis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/microservices/{analysisId}")
    public ResponseEntity<Microservice> addMicroservice(@PathVariable String analysisId, @RequestBody MicroserviceDTO microserviceDTO) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Microservice microservice = new Microservice();
            microservice.setName(microserviceDTO.getName());
            microservice.setRelevance(microserviceDTO.getRelevance());
            List<QualityAttribute> qualityAttributes = microserviceDTO.getQualityAttributes().stream()
                    .map(attrDTO -> {
                        QualityAttributeMS attr = new QualityAttributeMS();
                        attr.setName(attrDTO.getName());
                        attr.setCategory(attrDTO.getCategory());
                        attr.setRelevance(attrDTO.getRelevance());
                        return attr;
                    })
                    .collect(Collectors.toList());
            microservice.setQualityAttributes(qualityAttributes);
            AnalysisDatabaseSingleton.getInstance().addMicroservice(analysisId, microservice);
            return ResponseEntity.ok().body(microservice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/microservices/{analysisId}/{microserviceId}/{smellId}")
    public ResponseEntity<Void> assignMicroserviceToSmell(@PathVariable String analysisId, @PathVariable String microserviceId, @PathVariable int smellId) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        Microservice microservice = AnalysisDatabaseSingleton.getInstance().getMicroservice(analysisId, microserviceId);
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        TriageService triageService = new TriageService();
        smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
        smell.setMicroservice(microservice);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/microservices/{analysisId}")
    public ResponseEntity<Void> updateMicroservice(@PathVariable String analysisId, @RequestBody MicroserviceDTO microserviceDTO) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }

        Microservice microservice = AnalysisDatabaseSingleton.getInstance().getMicroservice(analysisId, microserviceDTO.getName());
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }

        microservice.setRelevance(microserviceDTO.getRelevance());
        List<QualityAttribute> updatedQualityAttributes = microserviceDTO.getQualityAttributes().stream()
                .map(attrDTO -> {
                    QualityAttributeMS attr = new QualityAttributeMS();
                    attr.setName(attrDTO.getName());
                    attr.setCategory(attrDTO.getCategory());
                    attr.setRelevance(attrDTO.getRelevance());
                    return attr;
                })
                .collect(Collectors.toList());
        microservice.setQualityAttributes(updatedQualityAttributes);

        TriageService triageService = new TriageService();
        for (Smell smell : analysis.getSmells()) {
            if (smell.getMicroservice() != null && smell.getMicroservice().getName().equals(microservice.getName())){
                smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
            }
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/microservices/{analysisId}/{microserviceName}")
    public ResponseEntity<Void> deleteMicroservice(@PathVariable String analysisId, @PathVariable String microserviceName) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }

        Microservice microservice = AnalysisDatabaseSingleton.getInstance().getMicroservice(analysisId, microserviceName);
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }

        boolean removed = AnalysisDatabaseSingleton.getInstance().removeMicroservice(analysisId, microservice);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        analysis.getSmells().forEach(smell -> {
            if (smell.getMicroservice() != null && smell.getMicroservice().getName().equals(microserviceName)) {
                smell.setMicroservice(null);
                smell.setUrgencyCode(null);
            }
        });

        return ResponseEntity.ok().build();
    }


    @PutMapping("/analysis/{analysisId}/smell/{smellId}/effortTime")
    public ResponseEntity<Void> setEffortTime(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody EffortTime effortTime) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setEffortTime(effortTime);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/checkbox")
    public ResponseEntity<Void> setCheckbox(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody boolean checkbox) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setChecked(checkbox);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/status")
    public ResponseEntity<Void> setStatus(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody SmellStatus smellStatus) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setStatus(smellStatus);
        return ResponseEntity.ok().build();
    }
}