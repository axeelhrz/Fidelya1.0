package tienda.empleados;

import tienda.utils.GratificacionConstants;

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
        double gratificacion;
        
        // Asignar gratificación según nivel usando las constantes
        switch (nivel) {
            case 1:
                gratificacion = GratificacionConstants.GRATIFICACION_NIVEL_1;
                break;
            case 2:
                gratificacion = GratificacionConstants.GRATIFICACION_NIVEL_2;
                break;
            case 3:
                gratificacion = GratificacionConstants.GRATIFICACION_NIVEL_3;
                break;
            default:
                gratificacion = 0;
        }
        // Si es nivel 2 y pedido > límite diurno, no se aplica retención
        if (nivel == 2 && montoPedido > GratificacionConstants.LIMITE_PEDIDO_DIURNO) {
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
