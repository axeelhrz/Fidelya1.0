package tienda.pedidos;

import tienda.productos.Producto;

/**
 * Representa un detalle de pedido (línea de pedido) con un producto y su cantidad.
 */
public class DetallePedido {
    private Producto producto;
    private int cantidad;
    
    /**
     * Constructor para detalle de pedido
     * @param producto Producto seleccionado
     * @param cantidad Cantidad solicitada
     */
    public DetallePedido(Producto producto, int cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
}

    /**
     * Calcula el precio total de esta línea de pedido
     * @return Precio total (precio del producto * cantidad)
     */
    public double calcularPrecio() {
        return producto.calcularPrecio(cantidad);
    }
    
    // Getters y setters
    public Producto getProducto() {
        return producto;
    }
    
    public int getCantidad() {
        return cantidad;
    }
    
    @Override
    public String toString() {
        return cantidad + " x " + producto.getNombre() + 
               " (" + producto.getPrecio() + "€/u) = " + 
               String.format("%.2f", calcularPrecio()) + "€";
    }
}