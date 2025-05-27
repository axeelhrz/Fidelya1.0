package tienda.productos;

/**
 * Representa un producto con fecha de caducidad.
 * El precio varía según los días que faltan para caducar.
 */
public class ProductoPerecedero extends Producto {
    private int diasParaCaducar;
    
    /**
     * Constructor para producto perecedero
     * @param codigo Código único del producto
     * @param nombre Nombre del producto
     * @param precio Precio base del producto
     * @param stock Cantidad disponible en inventario
     * @param diasParaCaducar Días restantes hasta la caducidad
     */
    public ProductoPerecedero(int codigo, String nombre, double precio, int stock, int diasParaCaducar) {
        super(codigo, nombre, precio, stock);
        this.diasParaCaducar = diasParaCaducar;
}

    public int getDiasParaCaducar() {
        return diasParaCaducar;
    }
    
    public void setDiasParaCaducar(int diasParaCaducar) {
        this.diasParaCaducar = diasParaCaducar;
    }
    
    @Override
    public double calcularPrecio(int cantidad) {
        double precioFinal = precio;
        
        // Aplicar descuento según los días para caducar
        if (diasParaCaducar == 1) {
            precioFinal = precio * 0.25; // 1/4 del precio
        } else if (diasParaCaducar == 2) {
            precioFinal = precio * (1.0/3.0); // 1/3 del precio
        } else if (diasParaCaducar == 3) {
            precioFinal = precio * 0.5; // 1/2 del precio
        }
        
        return precioFinal * cantidad;
    }
    
    @Override
    public String toString() {
        return super.toString() + ", Días para caducar: " + diasParaCaducar;
    }
}