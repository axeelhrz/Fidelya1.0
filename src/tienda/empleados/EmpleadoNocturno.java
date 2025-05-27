package tienda.empleados;

import tienda.utils.GratificacionConstants;

public class EmpleadoNocturno extends Empleado {
    private double plusNocturnidad;

    public EmpleadoNocturno(int codigo, String nombre, String password, int nivel, double plusNocturnidad) {
        super(codigo, nombre, password, nivel);
        this.plusNocturnidad = plusNocturnidad;
    }

    public double getPlusNocturnidad() {
        return plusNocturnidad;
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

        // Caso especial: si es nivel 1 y el pedido supera el límite nocturno, se duplica la gratificación
        if (nivel == 1 && montoPedido > GratificacionConstants.LIMITE_PEDIDO_NOCTURNO) {
            gratificacion *= 2;
        }

        // Plus por nocturnidad: porcentaje del total del pedido
        double plus = montoPedido * (plusNocturnidad / 100);

        double total = gratificacion + plus;
        incrementarProductividad(total);

        return total;
    }
}
