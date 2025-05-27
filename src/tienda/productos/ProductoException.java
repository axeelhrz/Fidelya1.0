package tienda.productos;

/**
 * Excepción personalizada para gestión de errores relacionados con productos.
 */
public class ProductoException extends Exception {
    private int codigo;
    
    /**
     * Constructor para excepción de producto
     * @param codigo Código de error
     * @param mensaje Mensaje descriptivo del error
     */
    public ProductoException(int codigo, String mensaje) {
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
     * Crea una excepción de stock insuficiente
     * @return Excepción con código 333
     */
    public static ProductoException stockInsuficiente() {
        return new ProductoException(333, "Error. Número insuficiente de productos disponibles");
    }
}