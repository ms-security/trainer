package org.ssv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.ssv.model.Analysis;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @PostMapping("/analysis")
    public ResponseEntity<Analysis> analysis(@RequestBody String analysis) throws Exception {
        System.out.println("Analysis: " + analysis);

        Analysis analysisObj = new Analysis(analysis);

        System.out.println("Smells: " + analysisObj.getSmell());

        return ResponseEntity.ok().body(analysisObj);
    }

}