package tienda.productos;

/**
 * Representa un producto que no caduca y puede tener ofertas asociadas.
 */
public class ProductoNoPerecedero extends Producto {
    private Oferta oferta;
    
    /**
     * Constructor para producto no perecedero
     * @param codigo Código único del producto
     * @param nombre Nombre del producto
     * @param precio Precio base del producto
     * @param stock Cantidad disponible en inventario
     * @param oferta Oferta asociada (puede ser null)
     */
    public ProductoNoPerecedero(int codigo, String nombre, double precio, int stock, Oferta oferta) {
        super(codigo, nombre, precio, stock);
        this.oferta = oferta;
}

    public Oferta getOferta() {
        return oferta;
    }
    
    public void setOferta(Oferta oferta) {
        this.oferta = oferta;
    }
    
    @Override
    public double calcularPrecio(int cantidad) {
        // Si tiene oferta, aplicarla
        if (oferta != null) {
            return oferta.aplicarOferta(precio, cantidad);
        }
        
        // Sin oferta, precio normal
        return precio * cantidad;
    }
    
    @Override
    public String toString() {
        String infoOferta = (oferta != null) ? ", Oferta: " + oferta.getDescripcion() : ", Sin oferta";
        return super.toString() + infoOferta;
    }
}