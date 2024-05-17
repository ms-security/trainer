package org.ssv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.*;
import org.ssv.service.AnalysisService;
import org.ssv.service.FactoryAnalysis;
import org.ssv.service.TriageService;
import org.ssv.service.util.ContentParser;
import org.ssv.service.util.JsonContentParser;
import org.ssv.service.util.TxtContentParser;

import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @Autowired
    private AnalysisService analysisService;

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
        //System.out.println("fetching analyses  " + analyses);
        return ResponseEntity.ok().body(analyses);
        //return ResponseEntity.ok().body((ArrayList<Analysis>) AnalysisDatabaseSingleton.getInstance().getAllAnalyses());
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<Analysis> getAnalysis(@PathVariable String analysisId) {
        //Analysis analysis = AnalysisDatabaseSingleton.getInstance().getAnalysis(analysisId);
        Analysis analysis = analysisService.findById(analysisId);
        if(analysis != null) {
            return ResponseEntity.ok().body(analysis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable String analysisId){
        boolean isRemoved = analysisService.deleteById(analysisId);
        if(isRemoved) {
            System.out.println("analysis removed");
            return ResponseEntity.ok().build();
        } else {
            System.out.println("analysis NOT removed");
            return ResponseEntity.notFound().build();
        }
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
    public ResponseEntity<Microservice> addMicroservice(@PathVariable String analysisId, @RequestBody MicroserviceDTO microserviceDTO) {
        Analysis analysis = analysisService.findById(analysisId);
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
            microservice.setAnalysis(analysis);
            analysisService.saveMicroservice(microservice);
            return ResponseEntity.ok().body(microservice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/microservices/{analysisId}/{microserviceName}/{smellId}")
    public ResponseEntity<Void> assignMicroserviceToSmell(@PathVariable String analysisId, @PathVariable String microserviceName, @PathVariable int smellId) {
        if (analysisService.findById(analysisId) == null) { return ResponseEntity.notFound().build(); }

        Microservice microservice = analysisService.findMicroserviceById(analysisId, microserviceName);
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }
        Smell smell = analysisService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        TriageService triageService = new TriageService();
        smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
        smell.setMicroservice(microservice);
        analysisService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/microservices/{analysisId}")
    public ResponseEntity<Void> updateMicroservice(@PathVariable String analysisId, @RequestBody MicroserviceDTO microserviceDTO) {
        System.out.println("updateMicroservice: " + microserviceDTO.getName() + " " + microserviceDTO.getRelevance() + " " + microserviceDTO.getQualityAttributes().size());

        Analysis analysis = analysisService.findById(analysisId);
        if (analysis == null) { return ResponseEntity.notFound().build(); }

        Microservice microservice = analysisService.findMicroserviceById(analysisId, microserviceDTO.getName());
        if (microservice == null) {
            return ResponseEntity.notFound().build();
        }
        microservice.getQualityAttributes().clear();
        analysisService.saveMicroservice(microservice);

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


        System.out.println("updateMicroservice: " + microservice.getName() + " " + microservice.getRelevance() + " " + microservice.getQualityAttributes().size());

        TriageService triageService = new TriageService();
        for (Smell smell : analysis.getSmells()) {
            if (smell.getMicroservice() != null && smell.getMicroservice().getName().equals(microservice.getName())){
                smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
            }
        }

        System.out.println("updateMicroservice: " +  microservice.getQualityAttributes());

        analysisService.saveMicroservice(microservice);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/microservices/{analysisId}/{microserviceName}")
    public ResponseEntity<Void> deleteMicroservice(@PathVariable String analysisId, @PathVariable String microserviceName) {
        Analysis analysis = analysisService.findById(analysisId);
        if (analysis == null) { return ResponseEntity.notFound().build(); }

        Microservice microservice = analysisService.findMicroserviceById(analysisId, microserviceName);
        if (microservice == null) {
            System.out.println("microservice not found");
            return ResponseEntity.notFound().build();
        }

        boolean removed = analysisService.deleteMicroservice(microserviceName);
        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        /*analysis.getSmells().forEach(smell -> {
            if (smell.getMicroservice() != null && smell.getMicroservice().getName().equals(microserviceName)) {
                smell.setMicroservice(null);
                smell.setUrgencyCode(null);
                analysisService.saveSmell(smell);
            }
        });*/

        return ResponseEntity.ok().build();
    }

    @PutMapping("/analysis/{analysisId}/smell/{smellId}/effortTime")
    public ResponseEntity<Void> setEffortTime(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody EffortTime effortTime) {
        Smell smell = analysisService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setEffortTime(effortTime);
        analysisService.saveEffortTime(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/checkbox")
    public ResponseEntity<Void> setCheckbox(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody boolean checkbox) {
        Smell smell = analysisService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setChecked(checkbox);
        analysisService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/status")
    public ResponseEntity<Void> setStatus(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody SmellStatus smellStatus) {
        Smell smell = analysisService.findSmellById(analysisId, smellId);
        if (smell == null) {
            return ResponseEntity.notFound().build();
        }
        smell.setStatus(smellStatus);
        analysisService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }
}