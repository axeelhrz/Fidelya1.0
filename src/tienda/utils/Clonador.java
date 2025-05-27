package tienda.utils;

import tienda.productos.Producto;
import tienda.productos.ProductoPerecedero;
import tienda.productos.ProductoNoPerecedero;

/**
 * Clase de utilidad para clonar objetos.
 */
public class Clonador {
    
    /**
     * Crea una copia de un producto
     * @param original Producto original a clonar
     * @return Copia del producto
     */
    public static Producto clonarProducto(Producto original) {
        if (original instanceof ProductoPerecedero) {
            ProductoPerecedero perecedero = (ProductoPerecedero) original;
            return new ProductoPerecedero(
                perecedero.getCodigo(),
                perecedero.getNombre(),
                perecedero.getPrecio(),
                perecedero.getStock(),
                perecedero.getDiasParaCaducar()
            );
        } else if (original instanceof ProductoNoPerecedero) {
            ProductoNoPerecedero noPerecedero = (ProductoNoPerecedero) original;
            return new ProductoNoPerecedero(
                noPerecedero.getCodigo(),
                noPerecedero.getNombre(),
                noPerecedero.getPrecio(),
                noPerecedero.getStock(),
                noPerecedero.getOferta()
            );
}

        return null;
    }
}