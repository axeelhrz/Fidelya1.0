package tienda.empleados;

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
        double gratificacion = nivel; // 1, 2 o 3 según nivel

        // Caso especial: si es nivel 1 y el pedido supera los 200€, se duplica la gratificación
        if (nivel == 1 && montoPedido > 200) {
            gratificacion *= 2;
        }

        // Plus por nocturnidad: porcentaje del total del pedido
        double plus = montoPedido * (plusNocturnidad / 100);

        double total = gratificacion + plus;
        incrementarProductividad(total);

        return total;
    }
}
