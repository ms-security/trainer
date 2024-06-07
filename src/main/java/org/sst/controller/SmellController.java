package org.sst.controller;

import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.sst.model.EffortTime;
import org.sst.model.Smell;
import org.sst.model.SmellStatus;
import org.sst.service.database.FacadeService;

/**
 * REST controller for managing smells.
 */
@RestController
@Api(tags = "Smells")
@RequestMapping("/analysis/{analysisId}/smell")
public class SmellController {

    @Autowired
    private FacadeService facadeService;

    /**
     * Retrieves a smell by analysis ID and smell ID.
     *
     * @param analysisId the ID of the analysis
     * @param smellId the ID of the smell
     * @return a ResponseEntity containing the retrieved smell
     */
    @ApiOperation(value = "Get a smell by analysis ID and smell ID", notes = "Provide analysis ID and smell ID to look up a specific smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully retrieved smell", response = Smell.class),
            @ApiResponse(code = 404, message = "Smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @GetMapping("/{smellId}")
    public ResponseEntity<?> getSmellById(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the smell", required = true) @PathVariable int smellId) {

        Smell smell = facadeService.findSmellById(analysisId, smellId);
        return ResponseEntity.ok().body(smell);
    }

    /**
     * Sets the effort time for a smell.
     *
     * @param analysisId the ID of the analysis
     * @param smellId the ID of the smell
     * @param effortTime the effort time details
     * @return a ResponseEntity with no content
     */
    @ApiOperation(value = "Set effort time for a smell", notes = "Provide analysis ID, smell ID, and effort time details to set effort time for a smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully set effort time"),
            @ApiResponse(code = 404, message = "Analysis or smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/{smellId}/effortTime")
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

    /**
     * Sets the checkbox value for a smell.
     *
     * @param analysisId the ID of the analysis
     * @param smellId the ID of the smell
     * @param checkbox the checkbox value
     * @return a ResponseEntity with no content
     */
    @ApiOperation(value = "Set checkbox for a smell", notes = "Provide analysis ID, smell ID, and checkbox value to set checkbox for a smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully set checkbox"),
            @ApiResponse(code = 404, message = "Analysis or smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/{smellId}/checkbox")
    public ResponseEntity<Void> setCheckbox(
            @ApiParam(value = "ID of the analysis", required = true) @PathVariable String analysisId,
            @ApiParam(value = "ID of the smell", required = true) @PathVariable int smellId,
            @ApiParam(value = "Checkbox value", required = true) @RequestBody boolean checkbox) {

        Smell smell = facadeService.findSmellById(analysisId, smellId);
        smell.setChecked(checkbox);
        facadeService.saveSmell(smell);
        return ResponseEntity.ok().build();
    }

    /**
     * Sets the status for a smell.
     *
     * @param analysisId the ID of the analysis
     * @param smellId the ID of the smell
     * @param smellStatus the status value
     * @return a ResponseEntity with no content
     */
    @ApiOperation(value = "Set status for a smell", notes = "Provide analysis ID, smell ID, and status details to set status for a smell")
    @ApiResponses({
            @ApiResponse(code = 200, message = "Successfully set status"),
            @ApiResponse(code = 404, message = "Analysis or smell not found"),
            @ApiResponse(code = 500, message = "Internal server error")
    })
    @PutMapping("/{smellId}/status")
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
