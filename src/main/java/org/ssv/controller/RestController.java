package org.ssv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.database.AnalysisDatabaseSingleton;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.*;
import org.ssv.service.FactoryAnalysis;
import org.ssv.service.TriageService;
import org.ssv.service.util.ContentParser;
import org.ssv.service.util.TxtContentParser;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @PostMapping("/analysis")
    public ResponseEntity<Analysis> analysis(@RequestParam("file") MultipartFile file,
                                             @RequestParam("name") String name,
                                             @RequestParam("date") String date) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Analysis.builder().id(-1).build());
        }
        try{
            String content = new String(file.getBytes(), StandardCharsets.UTF_8);
            ContentParser parser = new TxtContentParser();
            Analysis analysis = FactoryAnalysis.getInstance().createAnalysis(parser, content, name, date);
            AnalysisDatabaseSingleton.getInstance().addAnalysis(analysis); //add the analysis to the database
            return ResponseEntity.ok().body(analysis);   //return the analysis with list of smell
        } catch (InvalidContentException e){

            return ResponseEntity.badRequest().body(Analysis.builder().id(-2).build());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Analysis.builder().id(-3).build());
        }
    }

    @GetMapping("/analysis")
    public ResponseEntity<ArrayList<Analysis>> analysis() {
        return ResponseEntity.ok().body((ArrayList<Analysis>) AnalysisDatabaseSingleton.getInstance().getAllAnalyses());
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<Analysis> getAnalysis(@PathVariable int analysisId) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if(analysis != null) {
            return ResponseEntity.ok().body(analysis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable int analysisId) {
        boolean isRemoved = AnalysisDatabaseSingleton.getInstance().removeAnalysis(analysisId);
        if(isRemoved) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/analysis/{analysisId}/favorite")
    public ResponseEntity<Analysis> favoriteAnalysis(@PathVariable int analysisId) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if(analysis != null) {
            analysis.setFavorite(!analysis.isFavorite());
            return ResponseEntity.ok().body(analysis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/microservices/{analysisId}")
    public ResponseEntity<Microservice> addMicroservice(@PathVariable int analysisId, @RequestBody MicroserviceDTO microserviceDTO) {
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
    public ResponseEntity<Void> assignMicroserviceToSmell(@PathVariable int analysisId, @PathVariable String microserviceId, @PathVariable int smellId) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("Analysis found");
        Microservice microservice = AnalysisDatabaseSingleton.getInstance().getMicroservice(analysisId, microserviceId);
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("Microservice found");
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println("Smell found");
        TriageService triageService = new TriageService();
        smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
        smell.setMicroservice(microservice);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/microservices/{analysisId}")
    public ResponseEntity<Void> updateMicroservice(@PathVariable int analysisId, @RequestBody MicroserviceDTO microserviceDTO) {
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
    public ResponseEntity<Void> deleteMicroservice(@PathVariable int analysisId, @PathVariable String microserviceName) {
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
    public ResponseEntity<Void> setEffortTime(@PathVariable int analysisId, @PathVariable int smellId, @RequestBody EffortTime effortTime) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(effortTime);
        smell.setEffortTime(effortTime);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/checkbox")
    public ResponseEntity<Void> setCheckbox(@PathVariable int analysisId, @PathVariable int smellId, @RequestBody boolean checkbox) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(smell.isChecked());
        smell.setChecked(checkbox);
        System.out.println(smell.isChecked());
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/status")
    public ResponseEntity<Void> setStatus(@PathVariable int analysisId, @PathVariable int smellId, @RequestBody SmellStatus smellStatus) {
        Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = AnalysisDatabaseSingleton.getInstance().getSmell(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        System.out.println(smell.getStatus());
        smell.setStatus(smellStatus);
        return ResponseEntity.ok().build();
    }
}