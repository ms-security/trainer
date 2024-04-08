package org.ssv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.ssv.exception.EmptyContentException;
import org.ssv.exception.InvalidContentException;
import org.ssv.model.Analysis;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @PostMapping("/analysis")
    public ResponseEntity<Analysis> analysis(@RequestBody String jsonAnalysis) {
        System.out.println("Received analysis: " + jsonAnalysis);
        try{
            Analysis analysis = new Analysis(jsonAnalysis); //initialize the analysis
            return ResponseEntity.ok().body(analysis); //return the analysis with list of smell
        }
        catch(EmptyContentException e){
            return ResponseEntity.badRequest().body(Analysis.builder().id(-1).build());
        }
        catch (InvalidContentException e){
            return ResponseEntity.badRequest().body(Analysis.builder().id(-2).build());
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(Analysis.builder().id(-3).build());
        }
    }

}