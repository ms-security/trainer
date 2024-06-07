package org.sst.exception;

/**
 * Exception thrown when the content is invalid.
 */
public class InvalidContentException extends RuntimeException {

    /**
     * Constructs a new InvalidContentException with the specified detail message.
     *
     * @param message the detail message
     */
    public InvalidContentException(String message) {
        super(message);
    }
}
