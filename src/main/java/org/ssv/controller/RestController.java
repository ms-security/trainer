package org.ssv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.database.AnalysisDatabaseSingleton;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.*;
import org.ssv.service.TriageService;
import org.ssv.service.util.ContentParser;
import org.ssv.service.FactoryAnalysis;
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

}