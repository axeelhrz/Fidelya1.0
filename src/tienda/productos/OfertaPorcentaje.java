package tienda.productos;

/**
 * Implementación de oferta por porcentaje: descuento de un porcentaje sobre el precio
 * hasta un máximo de unidades
 */
public class OfertaPorcentaje implements Oferta {
    private int codigo;
    private double porcentaje;
    private int maximoUnidades;
    
    /**
     * Constructor para oferta por porcentaje
     * @param codigo Código único de la oferta
     * @param porcentaje Porcentaje de descuento (0-100)
     * @param maximoUnidades Número máximo de unidades con descuento
     */
    public OfertaPorcentaje(int codigo, double porcentaje, int maximoUnidades) {
        this.codigo = codigo;
        this.porcentaje = porcentaje;
        this.maximoUnidades = maximoUnidades;
}

    @Override
    public int getCodigo() {
        return codigo;
    }
    
    @Override
    public String getDescripcion() {
        return "Oferta " + porcentaje + "% de descuento (máx. " + maximoUnidades + " unidades)";
    }
    
    @Override
    public double aplicarOferta(double precioUnitario, int cantidad) {
        // Unidades con descuento (limitado por el máximo)
        int unidadesConDescuento = Math.min(cantidad, maximoUnidades);
        int unidadesSinDescuento = cantidad - unidadesConDescuento;
        
        // Precio con descuento para las unidades con oferta
        double precioConDescuento = precioUnitario * (1 - porcentaje / 100);
        
        return (unidadesConDescuento * precioConDescuento) + 
               (unidadesSinDescuento * precioUnitario);
    }
    
    // Getters adicionales
    public double getPorcentaje() {
        return porcentaje;
    }
    
    public int getMaximoUnidades() {
        return maximoUnidades;
    }
}