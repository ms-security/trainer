package org.ssv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.*;
import org.ssv.service.*;
import org.ssv.service.database.services.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @Autowired
    private AnalysisService analysisService;

    @Autowired
    private EffortTimeService effortTimeService;

    @Autowired
    private MicroserviceService microserviceService;

    @Autowired
    private RefactoringService refactoringService;

    @Autowired
    private SmellService smellService;

    @Autowired
    private QualityAttributeService qualityAttributeService;

    @PostMapping("/analysis")
    public ResponseEntity<Analysis> analysis(@RequestParam("file") MultipartFile file,
                                             @RequestParam("name") String name,
                                             @RequestParam("date") String date,
                                             @RequestParam("extension") String extension) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Analysis.builder().id("-1").build());
        }
        try{
            Analysis analysis = FactoryAnalysis.getInstance().createAnalysis(file, name, date, extension);
            try{
                analysisService.saveAnalysis(analysis); // persistent db
            } catch (Exception e){
                System.out.println("Controller : Error saving analysis: " + e.getMessage());
            }
            return ResponseEntity.ok().body(analysis);
        } catch (InvalidContentException e){
            return ResponseEntity.badRequest().body(Analysis.builder().id("-2").build());
        } catch (Exception e){
            return ResponseEntity.badRequest().body(Analysis.builder().id("-3").build());
        }
    }

    @GetMapping("/analysis")
    public ResponseEntity<ArrayList<Analysis>> analysis() throws SQLException {
        ArrayList<Analysis> analyses = (ArrayList<Analysis>) analysisService.getAllAnalyses();
        return ResponseEntity.ok().body(analyses);
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<Analysis> getAnalysis(@PathVariable String analysisId) {
        Analysis analysis = analysisService.findById(analysisId);
        return analysis != null ? ResponseEntity.ok().body(analysis) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable String analysisId){
        boolean isRemoved = analysisService.deleteById(analysisId);
        return isRemoved ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/analysis/{analysisId}/favorite")
    public ResponseEntity<Analysis> favoriteAnalysis(@PathVariable String analysisId) {
        Analysis analysis = analysisService.findById(analysisId);
        if(analysis != null) {
            analysis.setFavorite(!analysis.isFavorite());
            analysisService.saveAnalysis(analysis);
            return ResponseEntity.ok().body(analysis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/microservices/{analysisId}")
    public ResponseEntity<Microservice> addMicroservice(@PathVariable String analysisId, @RequestBody Microservice microservice) {
        Analysis analysis = analysisService.findById(analysisId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            microservice.setAnalysis(analysis);
            qualityAttributeService.saveQualityAttributes(microservice.getQualityAttributes());
            microserviceService.saveMicroservice(microservice);
            analysisService.saveAnalysis(analysis);
            return ResponseEntity.ok().body(microservice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/microservices/{analysisId}/{microserviceName}/{smellId}")
    public ResponseEntity<Void> assignMicroserviceToSmell(@PathVariable String analysisId, @PathVariable String microserviceName, @PathVariable int smellId) {
        if (analysisService.findById(analysisId) == null) { return ResponseEntity.notFound().build(); }

        Microservice microservice = microserviceService.findMicroserviceById(analysisId, microserviceName);
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = smellService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        TriageService triageService = new TriageService();
        smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
        smell.setMicroservice(microservice);
        smellService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/microservices/{analysisId}")
    public ResponseEntity<Void> updateMicroservice(@PathVariable String analysisId, @RequestBody Microservice microserviceTmp) {
        Analysis analysis = analysisService.findById(analysisId);
        if (analysis == null) { return ResponseEntity.notFound().build(); }
        Microservice microservice = microserviceService.findMicroserviceById(analysisId, microserviceTmp.getName());
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }
        microservice.setRelevance(microserviceTmp.getRelevance());
        microservice.getQualityAttributes().clear();
        qualityAttributeService.saveQualityAttributes(microservice.getQualityAttributes());
        microserviceService.saveMicroservice(microservice);
        microservice.setQualityAttributes(microserviceTmp.getQualityAttributes());
        TriageService triageService = new TriageService();
        for (Smell smell : analysis.getSmells()) {
            if (smell.getMicroservice() != null && smell.getMicroservice().getName().equals(microservice.getName())){
                smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
            }
        }
        qualityAttributeService.saveQualityAttributes(microservice.getQualityAttributes());
        microserviceService.saveMicroservice(microservice);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/microservices/{analysisId}/{microserviceName}")
    public ResponseEntity<Void> deleteMicroservice(@PathVariable String analysisId, @PathVariable String microserviceName) {
        Analysis analysis = analysisService.findById(analysisId);
        if (analysis == null) { return ResponseEntity.notFound().build(); }
        Microservice microservice = microserviceService.findMicroserviceById(analysisId, microserviceName);
        if (microservice == null) {
            System.out.println("microservice not found");
            return ResponseEntity.notFound().build();
        }
        List<Smell> smells = smellService.findByMicroservice(microservice);
        for (Smell smell : smells) {
            smell.setMicroservice(null);
            smell.setUrgencyCode(null);
            smellService.saveSmell(smell);
        }
        boolean removed = microserviceService.deleteMicroservice(microserviceName);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/analysis/{analysisId}/smell/{smellId}/effortTime")
    public ResponseEntity<Void> setEffortTime(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody EffortTime effortTime) {
        Smell smell = smellService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setEffortTime(effortTime);
        effortTimeService.saveEffortTime(effortTime);
        smellService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/checkbox")
    public ResponseEntity<Void> setCheckbox(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody boolean checkbox) {
        Smell smell = smellService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setChecked(checkbox);
        smellService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/status")
    public ResponseEntity<Void> setStatus(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody SmellStatus smellStatus) {
        Smell smell = smellService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setStatus(smellStatus);
        smellService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }
}