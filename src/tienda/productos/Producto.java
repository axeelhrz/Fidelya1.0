package tienda.productos;

/**
 * Clase abstracta que representa un producto genérico en la tienda.
 * Sirve como base para los productos perecederos y no perecederos.
 */
public abstract class Producto {
    protected int codigo;
    protected String nombre;
    protected double precio;
    protected int stock;
    
    /**
     * Constructor para crear un nuevo producto
     * @param codigo Código único del producto
     * @param nombre Nombre del producto
     * @param precio Precio base del producto
     * @param stock Cantidad disponible en inventario
     */
    public Producto(int codigo, String nombre, double precio, int stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
}

    // Getters y setters
    public int getCodigo() {
        return codigo;
    }
    
    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public double getPrecio() {
        return precio;
    }
    
    public void setPrecio(double precio) {
        this.precio = precio;
    }
    
    public int getStock() {
        return stock;
    }
    
    public void setStock(int stock) {
        this.stock = stock;
    }
    
    /**
     * Reduce el stock del producto en la cantidad especificada
     * @param cantidad Cantidad a reducir
     * @return true si hay suficiente stock, false en caso contrario
     */
    public boolean reducirStock(int cantidad) {
        if (stock >= cantidad) {
            stock -= cantidad;
            return true;
        }
        return false;
    }
    
    /**
     * Método abstracto para calcular el precio final del producto
     * @param cantidad Cantidad de unidades del producto
     * @return Precio final después de aplicar descuentos o modificaciones
     */
    public abstract double calcularPrecio(int cantidad);
    
    @Override
    public String toString() {
        return "Código: " + codigo + 
               ", Nombre: " + nombre + 
               ", Precio: " + precio + 
               "€, Stock: " + stock;
    }
}