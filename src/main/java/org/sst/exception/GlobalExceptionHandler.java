package org.sst.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Global exception handler for handling exceptions across the whole application.
 * Provides methods to handle specific exceptions and return appropriate HTTP responses.
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles InvalidContentException.
     *
     * @param ex the InvalidContentException to handle
     * @return a ResponseEntity with the exception message and HTTP status BAD_REQUEST
     */
    @ExceptionHandler(InvalidContentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<String> handleInvalidContentException(InvalidContentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles FileProcessingException.
     *
     * @param ex the FileProcessingException to handle
     * @return a ResponseEntity with the exception message and HTTP status INTERNAL_SERVER_ERROR
     */
    @ExceptionHandler(FileProcessingException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleFileProcessingException(FileProcessingException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles DatabaseException.
     *
     * @param ex the DatabaseException to handle
     * @return a ResponseEntity with the exception message and HTTP status INTERNAL_SERVER_ERROR
     */
    @ExceptionHandler(DatabaseException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleDatabaseException(DatabaseException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handles ResourceNotFoundException.
     *
     * @param ex the ResourceNotFoundException to handle
     * @return a ResponseEntity with the exception message and HTTP status NOT_FOUND
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    /**
     * Handles generic exceptions.
     *
     * @param ex the Exception to handle
     * @return a ResponseEntity with a generic error message and HTTP status INTERNAL_SERVER_ERROR
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<String> handleException(Exception ex) {
        return new ResponseEntity<>("An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
