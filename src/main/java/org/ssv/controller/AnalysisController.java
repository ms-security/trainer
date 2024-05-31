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
import java.util.List;

@RestController
@Api(tags = "Analyses")
@RequestMapping("/analysis")
public class AnalysisController {

    @Autowired
    private FacadeService facadeService;

    @ApiOperation(value = "Create a new analysis", notes = "Provide a file, name, date, and extension to create a new analysis")
    @ApiResponses({
            @ApiResponse(code = 201, message = "Analysis created successfully", response = Analysis.class),
            @ApiResponse(code = 400, message = "Invalid input data"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PostMapping
    public ResponseEntity<?> createAnalysis(
            @ApiParam(value = "File to be analyzed", required = true) @RequestParam("file") MultipartFile file,
            @ApiParam(value = "Name of the analysis", required = true) @RequestParam("name") String name,
            @ApiParam(value = "Date of the analysis", required = true) @RequestParam("date") String date,
            @ApiParam(value = "File extension", required = true) @RequestParam("extension") String extension) {

        Analysis analysis = FactoryAnalysis.getInstance().createAnalysis(file, name, date, extension);
        facadeService.saveAnalysis(analysis);
        return ResponseEntity.status(201).body(analysis);
    }

    @ApiOperation(value = "Get all analyses", notes = "Retrieve all analyses from the database")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully retrieved list", response = Analysis.class, responseContainer = "List"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @GetMapping
    public ResponseEntity<List<Analysis>> getAllAnalyses() throws SQLException {
        List<Analysis> analyses = facadeService.getAllAnalyses();
        return ResponseEntity.ok().body(analyses);
    }

    @ApiOperation(value = "Get an analysis by ID", notes = "Provide an ID to look up a specific analysis")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully retrieved analysis", response = Analysis.class),
            @ApiResponse(code = 404, message = "Analysis not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @GetMapping("/{analysisId}")
    public ResponseEntity<?> getAnalysisById(
            @ApiParam(value = "ID of the analysis to retrieve", required = true) @PathVariable String analysisId) {

        Analysis analysis = facadeService.findAnalysisById(analysisId);
        return ResponseEntity.ok().body(analysis);
    }

    @ApiOperation(value = "Delete an analysis by ID", notes = "Provide an ID to delete a specific analysis")
    @ApiResponses({
            @ApiResponse(code = 204, message = "Successfully deleted analysis"),
            @ApiResponse(code = 404, message = "Analysis not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @DeleteMapping("/{analysisId}")
    public ResponseEntity<Void> deleteAnalysisById(
            @ApiParam(value = "ID of the analysis to delete", required = true) @PathVariable String analysisId) {

        facadeService.deleteAnalysisById(analysisId);
        return ResponseEntity.noContent().build();
    }

    @ApiOperation(value = "Toggle favorite status of an analysis", notes = "Provide an analysis ID to toggle its favorite status")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully toggled favorite status", response = Analysis.class),
            @ApiResponse(code = 404, message = "Analysis not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/{analysisId}/favorite")
    public ResponseEntity<Analysis> toggleFavoriteStatus(
            @ApiParam(value = "ID of the analysis to toggle favorite status", required = true) @PathVariable String analysisId) {

        Analysis analysis = facadeService.findAnalysisById(analysisId);
        analysis.setFavorite(!analysis.isFavorite());
        facadeService.saveAnalysis(analysis);
        return ResponseEntity.ok().body(analysis);
    }
}