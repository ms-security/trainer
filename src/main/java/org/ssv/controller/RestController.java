package org.ssv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssv.database.AnalysisDatabaseSingleton;
import org.ssv.exception.EmptyContentException;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;
import org.ssv.service.FactoryAnalysis;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

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
            Analysis analysis = FactoryAnalysis.getInstance().createAnalysis(content, name, date);
            AnalysisDatabaseSingleton.getInstance().addAnalysis(analysis); //add the analysis to the database
            return ResponseEntity.ok().body(analysis);   //return the analysis with list of smell
        } catch (InvalidContentException e){
            return ResponseEntity.badRequest().body(Analysis.builder().id(-2).build());
        } catch (Exception e){
            return ResponseEntity.badRequest().body(Analysis.builder().id(-3).build());
        }
    }

    @GetMapping("/analysis")
    public ResponseEntity<ArrayList<Analysis>> analysis() {
        return ResponseEntity.ok().body((ArrayList<Analysis>) AnalysisDatabaseSingleton.getInstance().getAllAnalyses());
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

}