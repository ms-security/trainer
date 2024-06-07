package org.sst.exception;

/**
 * Exception thrown when there is an error processing a file.
 */
public class FileProcessingException extends RuntimeException {

    /**
     * Constructs a new FileProcessingException with the specified detail message.
     *
     * @param message the detail message
     */
    public FileProcessingException(String message) {
        super(message);
    }
}
