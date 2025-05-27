package tienda.empleados;

/**
 * Excepción personalizada para gestión de errores relacionados con empleados.
 */
public class EmpleadoException extends Exception {
    private int codigo;
    
    /**
     * Constructor para excepción de empleado
     * @param codigo Código de error
     * @param mensaje Mensaje descriptivo del error
     */
    public EmpleadoException(int codigo, String mensaje) {
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
    public static EmpleadoException loginIncorrecto() {
        return new EmpleadoException(111, "Error. Login incorrecto");
    }
    
    /**
     * Crea una excepción de password incorrecto
     * @return Excepción con código 222
     */
    public static EmpleadoException passwordIncorrecto() {
        return new EmpleadoException(222, "Error. Password incorrecto");
    }
}