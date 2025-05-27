package tienda.productos;

/**
 * Interface que define el comportamiento de las ofertas aplicables a productos.
 */
public interface Oferta {
    /**
     * Identificador único de la oferta
     * @return Código de la oferta
     */
    int getCodigo();
    
    /**
     * Descripción de la oferta para mostrar al usuario
     * @return Texto descriptivo de la oferta
     */
    String getDescripcion();
    
    /**
     * Calcula el precio final después de aplicar la oferta
     * @param precioUnitario Precio unitario del producto
     * @param cantidad Cantidad de unidades del producto
     * @return Precio final con la oferta aplicada
     */
    double aplicarOferta(double precioUnitario, int cantidad);
}
