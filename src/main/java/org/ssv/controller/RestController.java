package org.ssv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssv.database.AnalysisDatabase;
import org.ssv.exception.EmptyContentException;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;

import java.util.ArrayList;
import java.util.HashMap;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @PostMapping("/analysis")
    public ResponseEntity<Analysis> analysis(@RequestBody String jsonAnalysis) {
        System.out.println("Received analysis: " + jsonAnalysis);
        try{
            Analysis analysis = new Analysis(jsonAnalysis); //initialize the analysis
            AnalysisDatabase.getInstance().addAnalysis(analysis); //add the analysis to the database
            System.out.println("date: " + analysis.getDate());
            return ResponseEntity.ok().body(analysis); //return the analysis with list of smell
        }
        catch(EmptyContentException e){
            return ResponseEntity.badRequest().body(Analysis.builder().id(-1).build());
        }
        catch (InvalidContentException e){
            return ResponseEntity.badRequest().body(Analysis.builder().id(-2).build());
        }
        catch (Exception e){
            System.out.println("" + e.getMessage());
            return ResponseEntity.badRequest().body(Analysis.builder().id(-3).build());
        }
    }

    @GetMapping("/analysis")
    public ResponseEntity<ArrayList<Analysis>> analysis() {
        return ResponseEntity.ok().body(AnalysisDatabase.getInstance().getAllAnalyses());
    }

    @DeleteMapping("/analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(@PathVariable int analysisId) {
        boolean isRemoved = AnalysisDatabase.getInstance().removeAnalysis(analysisId);
        if(isRemoved) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/analysis/{analysisId}/favorite")
    public ResponseEntity<Analysis> favoriteAnalysis(@PathVariable int analysisId) {
        System.out.println("Favorite analysis: " + analysisId);
        Analysis analysis = AnalysisDatabase.getInstance().getAnalysis(analysisId);
        if(analysis != null) {
            analysis.setFavorite(!analysis.isFavorite());
            return ResponseEntity.ok().body(analysis);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}