package org.sst.exception;

/**
 * Exception thrown when there is an error with database operations.
 */
public class DatabaseException extends RuntimeException {

    /**
     * Constructs a new DatabaseException with the specified detail message.
     *
     * @param message the detail message
     */
    public DatabaseException(String message) {
        super(message);
    }
}
