package org.ssv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.model.*;
import org.ssv.service.*;
import org.ssv.service.database.FacadeService;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @Autowired
    private FacadeService facadeService;

    @PostMapping("/analysis")
    public ResponseEntity<?> analysis(@RequestParam("file") MultipartFile file,
                                      @RequestParam("name") String name,
                                      @RequestParam("date") String date,
                                      @RequestParam("extension") String extension) {
        Analysis analysis = FactoryAnalysis.getInstance().createAnalysis(file, name, date, extension);
        facadeService.saveAnalysis(analysis);
        return ResponseEntity.ok().body(analysis);
    }


    @GetMapping("/analysis")
    public ResponseEntity<List<Analysis>> analysis() throws SQLException {
        List<Analysis> analyses = facadeService.getAllAnalyses();
        return ResponseEntity.ok().body(analyses);
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<?> getAnalysis(@PathVariable String analysisId) {
        Analysis analysis = facadeService.findAnalysisById(analysisId);
        return ResponseEntity.ok().body(analysis);
    }

    @GetMapping("/analysis/{analysisId}/smell/{smellId}")
    public ResponseEntity<?> getSmell(@PathVariable String analysisId, @PathVariable int smellId) {
        Smell smell = facadeService.findSmellById(analysisId, smellId);
        return ResponseEntity.ok().body(smell);
    }

    @DeleteMapping("/analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable String analysisId){
        facadeService.deleteAnalysisById(analysisId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/analysis/{analysisId}/favorite")
    public ResponseEntity<Analysis> favoriteAnalysis(@PathVariable String analysisId) {
        Analysis analysis = facadeService.findAnalysisById(analysisId);
        analysis.setFavorite(!analysis.isFavorite());
        facadeService.saveAnalysis(analysis);
        return ResponseEntity.ok().body(analysis);
    }

    @PostMapping("/microservices/{analysisId}")
    public ResponseEntity<Microservice> addMicroservice(@PathVariable String analysisId, @RequestBody Microservice microservice) {
        Analysis analysis = facadeService.findAnalysisById(analysisId);
        microservice.setAnalysis(analysis);
        facadeService.saveMicroservice(microservice);
        return ResponseEntity.ok().body(microservice);
    }

    @PutMapping("/microservices/{analysisId}/{microserviceId}/{smellId}")
    public ResponseEntity<Void> assignMicroserviceToSmell(@PathVariable String analysisId, @PathVariable int microserviceId, @PathVariable int smellId) {
        facadeService.findAnalysisById(analysisId);
        Smell smell = facadeService.findSmellById(analysisId, smellId);
        if (microserviceId == -1) {
            smell.setMicroservice(null);
            smell.setUrgencyCode(null);
            facadeService.saveSmell(smell);
            return ResponseEntity.ok().build();
        }

        Microservice microservice = facadeService.findMicroserviceById(analysisId, microserviceId);
        TriageService triageService = new TriageService();
        smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
        smell.setMicroservice(microservice);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/microservices/{analysisId}/{microserviceId}/smells")
    public ResponseEntity<Void> assignMicroservicesToMultipleSmells(@PathVariable String analysisId, @PathVariable int microserviceId, @RequestBody ArrayList<Integer> smellsIds) {
        Analysis analysis = facadeService.findAnalysisById(analysisId);
        Microservice microservice = facadeService.findMicroserviceById(analysisId, microserviceId);
        TriageService triageService = new TriageService();
        for (int smellId : smellsIds) {
            Smell smell = facadeService.findSmellById(analysisId, smellId);
            if (smell != null) {
                smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
                smell.setMicroservice(microservice);
                facadeService.saveSmell(smell);
            }
        }
        return ResponseEntity.ok().build();
    }

    @PutMapping("/microservices/{analysisId}")
    public ResponseEntity<Void> updateMicroservice(@PathVariable String analysisId, @RequestBody Microservice microserviceTmp) {
        Analysis analysis = facadeService.findAnalysisById(analysisId);
        Microservice microservice = facadeService.findMicroserviceById(analysisId, microserviceTmp.getId());

        facadeService.updateMicroservice(microservice, microserviceTmp);
        TriageService triageService = new TriageService();
        for (Smell smell : analysis.getSmells()) {
            if (smell.getMicroservice() != null && smell.getMicroservice().getName().equals(microservice.getName())) {
                smell.setUrgencyCode(triageService.urgencyCodeCalculator(microservice, smell));
                facadeService.saveSmell(smell);
            }
        }
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/microservices/{analysisId}/{microserviceId}")
    public ResponseEntity<Void> deleteMicroservice(@PathVariable String analysisId, @PathVariable int microserviceId) {
        facadeService.findAnalysisById(analysisId);
        Microservice microservice = facadeService.findMicroserviceById(analysisId, microserviceId);
        facadeService.deleteMicroservice(microservice);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/analysis/{analysisId}/smell/{smellId}/effortTime")
    public ResponseEntity<Void> setEffortTime(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody EffortTime effortTime) {
        Smell smell = facadeService.findSmellById(analysisId, smellId);
        smell.setEffortTime(effortTime);
        facadeService.saveEffortTime(effortTime);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/checkbox")
    public ResponseEntity<Void> setCheckbox(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody boolean checkbox) {
        Smell smell = facadeService.findSmellById(analysisId, smellId);
        smell.setChecked(checkbox);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @PutMapping("analysis/{analysisId}/smell/{smellId}/status")
    public ResponseEntity<Void> setStatus(@PathVariable String analysisId, @PathVariable int smellId, @RequestBody SmellStatus smellStatus) {
        Smell smell = facadeService.findSmellById(analysisId, smellId);
        smell.setStatus(smellStatus);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }
}