package tienda.productos;

/**
 * Implementación de oferta 3x2: por cada 3 unidades, se pagan solo 2
 */
public class Oferta3x2 implements Oferta {
    private int codigo;
    
    public Oferta3x2(int codigo) {
        this.codigo = codigo;
}

    @Override
    public int getCodigo() {
        return codigo;
    }
    
    @Override
    public String getDescripcion() {
        return "Oferta 3x2: Lleva 3 y paga 2";
    }
    
    @Override
    public double aplicarOferta(double precioUnitario, int cantidad) {
        // Calcula grupos completos de 3 y unidades sueltas
        int gruposDeTres = cantidad / 3;
        int unidadesSueltas = cantidad % 3;
        
        // Por cada grupo de 3, se pagan 2
        return (gruposDeTres * 2 + unidadesSueltas) * precioUnitario;
    }
}