package tienda.empleados;

public class EmpleadoDiurno extends Empleado {
    private double retencion;

    public EmpleadoDiurno(int codigo, String nombre, String password, int nivel, double retencion) {
        super(codigo, nombre, password, nivel);
        this.retencion = retencion;
    }

    public double getRetencion() {
        return retencion;
    }

    @Override
    public double calcularGratificacion(double montoPedido) {
        double gratificacion = nivel; // 1€, 2€, 3€ según nivel

        // Si es nivel 2 y pedido > 300€, no se aplica retención
        if (nivel == 2 && montoPedido > 300) {
            // sin retención
        } else if (nivel == 1) {
            retencion = 0; // nivel 1 nunca tiene retención
        } else {
            gratificacion -= gratificacion * (retencion / 100);
        }

        incrementarProductividad(gratificacion);
        return gratificacion;
    }
}
