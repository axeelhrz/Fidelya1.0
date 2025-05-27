package tienda.utils;

/**
 * Excepción personalizada para errores relacionados con la base de datos.
 */
public class DatabaseException extends Exception {
    
    /**
     * Constructor para excepción de base de datos
     * @param message Mensaje descriptivo del error
     * @param cause Causa original del error
     */
    public DatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
    
    /**
     * Constructor para excepción de base de datos sin causa
     * @param message Mensaje descriptivo del error
     */
    public DatabaseException(String message) {
        super(message);
    }
}