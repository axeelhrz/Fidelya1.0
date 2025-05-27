package tienda.pedidos;

import tienda.empleados.Empleado;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

/**
 * Representa un pedido completo con múltiples detalles de pedido.
 */
public class Pedido {
    private static int contadorPedidos = 1;
    
    private int numeroPedido;
    private Empleado empleado;
    private DetallePedido[] detalles;
    private int numDetalles;
    private LocalDateTime fecha;
    
    /**
     * Constructor para un nuevo pedido
     * @param empleado Empleado que realiza el pedido
     * @param capacidadMaxima Número máximo de líneas de detalle
     */
    public Pedido(Empleado empleado, int capacidadMaxima) {
        this.numeroPedido = contadorPedidos++;
        this.empleado = empleado;
        this.detalles = new DetallePedido[capacidadMaxima];
        this.numDetalles = 0;
        this.fecha = LocalDateTime.now();
}

    /**
     * Añade un detalle de pedido
     * @param detalle Detalle a añadir
     * @return true si se pudo añadir, false si no hay espacio
     */
    public boolean agregarDetalle(DetallePedido detalle) {
        if (numDetalles < detalles.length) {
            detalles[numDetalles++] = detalle;
            return true;
        }
        return false;
    }
    
    /**
     * Calcula el precio total del pedido
     * @return Suma de los precios de todos los detalles
     */
    public double calcularTotal() {
        double total = 0;
        for (int i = 0; i < numDetalles; i++) {
            total += detalles[i].calcularPrecio();
        }
        return total;
    }
    
    /**
     * Genera una factura en formato texto
     * @return Cadena con la factura formateada
     */
    public String generarFactura() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
        StringBuilder factura = new StringBuilder();
        
        factura.append("=================================================\n");
        factura.append("                 FACTURA DE PEDIDO               \n");
        factura.append("=================================================\n");
        factura.append("Número de pedido: ").append(numeroPedido).append("\n");
        factura.append("Fecha: ").append(fecha.format(formatter)).append("\n");
        factura.append("Empleado: ").append(empleado.getNombre()).append("\n");
        factura.append("-------------------------------------------------\n");
        factura.append("DETALLES DEL PEDIDO:\n");
        
        for (int i = 0; i < numDetalles; i++) {
            factura.append(i + 1).append(". ").append(detalles[i].toString()).append("\n");
        }
        
        factura.append("-------------------------------------------------\n");
        factura.append("TOTAL: ").append(String.format("%.2f", calcularTotal())).append("€\n");
        
        // Calcular y mostrar la gratificación del empleado
        double gratificacion = empleado.calcularGratificacion(calcularTotal());
        factura.append("Gratificación del empleado: ").append(String.format("%.2f", gratificacion)).append("€\n");
        factura.append("=================================================\n");
        
        return factura.toString();
    }
    
    // Getters
    public int getNumeroPedido() {
        return numeroPedido;
    }
    
    public Empleado getEmpleado() {
        return empleado;
    }
    
    public DetallePedido[] getDetalles() {
        return Arrays.copyOf(detalles, numDetalles);
    }
    
    public int getNumDetalles() {
        return numDetalles;
    }
    
    public LocalDateTime getFecha() {
        return fecha;
    }
}