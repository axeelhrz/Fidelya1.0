package tienda.empleados;

public abstract class Empleado {
    protected int codigo;
    protected String nombre;
    protected String password;
    protected int nivel;
    protected double productividad;

    public Empleado(int codigo, String nombre, String password, int nivel) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.password = password;
        this.nivel = nivel;
        this.productividad = 0;
    }

    public abstract double calcularGratificacion(double montoPedido);

    public int getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getPassword() { return password; }
    public int getNivel() { return nivel; }
    public double getProductividad() { return productividad; }
    public void setProductividad(double p) { this.productividad = p; }

    public void incrementarProductividad(double valor) {
        this.productividad += valor;
    }
}
