package org.ssv.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@org.springframework.web.bind.annotation.RestController
public class RestController {

    @PostMapping("/analysis")
    public ResponseEntity<Void> analysis(@RequestBody String analysis) {
        System.out.println("Analysis: " + analysis);

        return ResponseEntity.ok().build();
    }

}