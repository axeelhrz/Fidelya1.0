package tienda.empleados;

/**
 * Excepción personalizada para errores de autenticación de empleados.
 */
public class AutenticacionException extends Exception {
    private int codigo;
    
    /**
     * Constructor para excepción de autenticación
     * @param codigo Código de error
     * @param mensaje Mensaje descriptivo del error
     */
    public AutenticacionException(int codigo, String mensaje) {
        super(mensaje);
        this.codigo = codigo;
    }
    
    /**
     * Obtiene el código de error
     * @return Código numérico del error
     */
    public int getCodigo() {
        return codigo;
    }
    
    /**
     * Crea una excepción de login incorrecto
     * @return Excepción con código 111
     */
    public static AutenticacionException loginIncorrecto() {
        return new AutenticacionException(111, "Error. Login incorrecto");
    }
    
    /**
     * Crea una excepción de password incorrecto
     * @return Excepción con código 222
     */
    public static AutenticacionException passwordIncorrecto() {
        return new AutenticacionException(222, "Error. Password incorrecto");
    }
}