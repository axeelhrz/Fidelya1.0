package tienda.productos;

/**
 * Implementación de oferta 2x1: por cada 2 unidades, se paga solo 1
 */
public class Oferta2x1 implements Oferta {
    private int codigo;
    
    public Oferta2x1(int codigo) {
        this.codigo = codigo;
}

    @Override
    public int getCodigo() {
        return codigo;
    }
    
    @Override
    public String getDescripcion() {
        return "Oferta 2x1: Lleva 2 y paga 1";
    }
    
    @Override
    public double aplicarOferta(double precioUnitario, int cantidad) {
        // Calcula cuántas unidades se pagan (la mitad redondeando hacia arriba)
        int unidadesAPagar = cantidad / 2 + cantidad % 2;
        return unidadesAPagar * precioUnitario;
    }
}