package org.ssv.controller;

import io.swagger.annotations.*;
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
@Api(tags = "Analyses")
public class RestController {

    @Autowired
    private FacadeService facadeService;

    @ApiOperation(value = "Create a new analysis", notes = "Provide a file, name, date, and extension to create a new analysis")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Analysis created successfully", response = Analysis.class),
            @ApiResponse(code = 400, message = "Invalid input data"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PostMapping("/analysis")
    public ResponseEntity<?> analysis(
            @ApiParam(value = "File to be analyzed", required = true) @RequestParam("file") MultipartFile file,
            @ApiParam(value = "Name of the analysis", required = true) @RequestParam("name") String name,
            @ApiParam(value = "Date of the analysis", required = true) @RequestParam("date") String date,
            @ApiParam(value = "File extension", required = true) @RequestParam("extension") String extension) {

        Analysis analysis = FactoryAnalysis.getInstance().createAnalysis(file, name, date, extension);
        facadeService.saveAnalysis(analysis);
        return ResponseEntity.ok().body(analysis);
    }

    @ApiOperation(value = "Get all analyses", notes = "Retrieve all analyses from the database")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully retrieved list", response = Analysis.class, responseContainer = "List"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @GetMapping("/analysis")
    public ResponseEntity<List<Analysis>> analysis() throws SQLException {
        List<Analysis> analyses = facadeService.getAllAnalyses();
        return ResponseEntity.ok().body(analyses);
    }

    @ApiOperation(value = "Get an analysis by ID", notes = "Provide an ID to look up a specific analysis")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully retrieved analysis", response = Analysis.class),
            @ApiResponse(code = 404, message = "Analysis not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<?> getAnalysis(
            @ApiParam(value = "ID of the analysis to retrieve", required = true) @PathVariable String analysisId) {

        Analysis analysis = facadeService.findAnalysisById(analysisId);
        return ResponseEntity.ok().body(analysis);
    }

    @ApiOperation(value = "Get a smell by analysis ID and smell ID", notes = "Provide analysis ID and smell ID to look up a specific smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully retrieved smell", response = Smell.class),
            @ApiResponse(code = 404, message = "Smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @GetMapping("/analysis/{analysisId}/smell/{smellId}")
    public ResponseEntity<?> getSmell(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the smell", required = true) @PathVariable int smellId) {

        Smell smell = facadeService.findSmellById(analysisId, smellId);
        return ResponseEntity.ok().body(smell);
    }

    @ApiOperation(value = "Delete an analysis by ID", notes = "Provide an ID to delete a specific analysis")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully deleted analysis"),
            @ApiResponse(code = 404, message = "Analysis not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @DeleteMapping("/analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(
            @ApiParam(value = "ID of the analysis to delete", required = true) @PathVariable String analysisId) {

        facadeService.deleteAnalysisById(analysisId);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Toggle favorite status of an analysis", notes = "Provide an analysis ID to toggle its favorite status")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully toggled favorite status", response = Analysis.class),
            @ApiResponse(code = 404, message = "Analysis not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/analysis/{analysisId}/favorite")
    public ResponseEntity<Analysis> favoriteAnalysis(
            @ApiParam(value = "ID of the analysis to toggle favorite status", required = true) @PathVariable String analysisId) {

        Analysis analysis = facadeService.findAnalysisById(analysisId);
        analysis.setFavorite(!analysis.isFavorite());
        facadeService.saveAnalysis(analysis);
        return ResponseEntity.ok().body(analysis);
    }

    @ApiOperation(value = "Add a new microservice to an analysis", notes = "Provide an analysis ID and microservice details to add a new microservice")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully added microservice", response = Microservice.class),
            @ApiResponse(code = 404, message = "Analysis not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PostMapping("/microservices/{analysisId}")
    public ResponseEntity<Microservice> addMicroservice(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "Details of the microservice to add", required = true) @RequestBody Microservice microservice) {

        Analysis analysis = facadeService.findAnalysisById(analysisId);
        microservice.setAnalysis(analysis);
        facadeService.saveMicroservice(microservice);
        return ResponseEntity.ok().body(microservice);
    }

    @ApiOperation(value = "Assign a microservice to a smell", notes = "Provide analysis ID, microservice ID, and smell ID to assign a microservice to a smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully assigned microservice to smell"),
            @ApiResponse(code = 404, message = "Analysis, microservice or smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/microservices/{analysisId}/{microserviceId}/{smellId}")
    public ResponseEntity<Void> assignMicroserviceToSmell(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the microservice", required = true) @PathVariable int microserviceId,
            @ApiParam(value = "ID of the smell", required = true) @PathVariable int smellId) {

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

    @ApiOperation(value = "Assign a microservice to multiple smells", notes = "Provide analysis ID, microservice ID, and list of smell IDs to assign a microservice to multiple smells")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully assigned microservice to multiple smells"),
            @ApiResponse(code = 404, message = "Analysis or microservice not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/microservices/{analysisId}/{microserviceId}/smells")
    public ResponseEntity<Void> assignMicroservicesToMultipleSmells(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the microservice", required = true) @PathVariable int microserviceId,
            @ApiParam(value = "List of smell IDs", required = true) @RequestBody List<Integer> smellsIds) {

        facadeService.findAnalysisById(analysisId);
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

    @ApiOperation(value = "Update a microservice", notes = "Provide analysis ID and microservice details to update a microservice")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully updated microservice"),
            @ApiResponse(code = 404, message = "Analysis or microservice not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/microservices/{analysisId}")
    public ResponseEntity<Void> updateMicroservice(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "Updated microservice details", required = true) @RequestBody Microservice microserviceTmp) {

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

    @ApiOperation(value = "Delete a microservice by ID", notes = "Provide analysis ID and microservice ID to delete a specific microservice")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully deleted microservice"),
            @ApiResponse(code = 404, message = "Analysis or microservice not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @DeleteMapping("/microservices/{analysisId}/{microserviceId}")
    public ResponseEntity<Void> deleteMicroservice(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the microservice to delete", required = true) @PathVariable int microserviceId) {

        facadeService.findAnalysisById(analysisId);
        Microservice microservice = facadeService.findMicroserviceById(analysisId, microserviceId);
        facadeService.deleteMicroservice(microservice);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Set effort time for a smell", notes = "Provide analysis ID, smell ID, and effort time details to set effort time for a smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully set effort time"),
            @ApiResponse(code = 404, message = "Analysis or smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/analysis/{analysisId}/smell/{smellId}/effortTime")
    public ResponseEntity<Void> setEffortTime(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the smell", required = true) @PathVariable int smellId,
            @ApiParam(value = "Effort time details", required = true) @RequestBody EffortTime effortTime) {

        Smell smell = facadeService.findSmellById(analysisId, smellId);
        smell.setEffortTime(effortTime);
        facadeService.saveEffortTime(effortTime);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Set checkbox for a smell", notes = "Provide analysis ID, smell ID, and checkbox value to set checkbox for a smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully set checkbox"),
            @ApiResponse(code = 404, message = "Analysis or smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("analysis/{analysisId}/smell/{smellId}/checkbox")
    public ResponseEntity<Void> setCheckbox(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the smell", required = true) @PathVariable int smellId,
            @ApiParam(value = "Checkbox value", required = true) @RequestBody boolean checkbox) {

        Smell smell = facadeService.findSmellById(analysisId, smellId);
        smell.setChecked(checkbox);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    @ApiOperation(value = "Set status for a smell", notes = "Provide analysis ID, smell ID, and status details to set status for a smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully set status"),
            @ApiResponse(code = 404, message = "Analysis or smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("analysis/{analysisId}/smell/{smellId}/status")
    public ResponseEntity<Void> setStatus(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the smell", required = true) @PathVariable int smellId,
            @ApiParam(value = "Status details", required = true) @RequestBody SmellStatus smellStatus) {

        Smell smell = facadeService.findSmellById(analysisId, smellId);
        smell.setStatus(smellStatus);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }
}