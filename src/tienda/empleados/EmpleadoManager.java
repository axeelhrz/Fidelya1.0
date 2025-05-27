package tienda.empleados;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Scanner;
import tienda.utils.Constantes;
import tienda.utils.Validador;

/**
 * Clase para gestionar empleados y el proceso de login.
 */
public class EmpleadoManager {
    private Empleado[] empleados;
    private int numEmpleados;
    private Empleado empleadoActual;
    
    /**
     * Constructor que inicializa el gestor de empleados
     * @param capacidadMaxima Número máximo de empleados
     */
    public EmpleadoManager(int capacidadMaxima) {
        this.empleados = new Empleado[capacidadMaxima];
        this.numEmpleados = 0;
        this.empleadoActual = null;
}

    /**
     * Carga los empleados desde un archivo
     * @param rutaArchivo Ruta del archivo de empleados
     * @throws IOException Si hay error al leer el archivo
     */
    public void cargarEmpleados(String rutaArchivo) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(rutaArchivo))) {
            String linea;
            while ((linea = br.readLine()) != null && numEmpleados < empleados.length) {
                String[] datos = linea.split(Constantes.SEPARADOR);
                if (datos.length >= 5) {
                    int codigo = Integer.parseInt(datos[0]);
                    String nombre = datos[1];
                    String password = datos[2];
                    int nivel = Integer.parseInt(datos[3]);
                    String turno = datos[4];
                    double valor = Double.parseDouble(datos[5]);
                    
                    Empleado empleado;
                    if (turno.equals(Constantes.TURNO_NOCTURNO)) {
                        empleado = new EmpleadoNocturno(codigo, nombre, password, nivel, valor);
                    } else {
                        empleado = new EmpleadoDiurno(codigo, nombre, password, nivel, valor);
                    }
                    
                    empleados[numEmpleados++] = empleado;
                }
            }
            System.out.println("Se han cargado " + numEmpleados + " empleados.");
        }
    }
    
    /**
     * Realiza el proceso de login
     * @param scanner Scanner para leer entrada del usuario
     * @return true si el login fue exitoso, false en caso contrario
     */
    public boolean login(Scanner scanner) {
        System.out.println("\n=== LOGIN DE EMPLEADO ===");
        
        try {
            // Solicitar código de empleado
            int codigo = Validador.solicitarEntero(scanner, "Introduzca su código de empleado", 1, 9999);
            
            // Buscar empleado por código
            Empleado empleado = buscarEmpleadoPorCodigo(codigo);
            if (empleado == null) {
                throw EmpleadoException.loginIncorrecto();
            }
            
            // Solicitar contraseña
            String password = Validador.solicitarCadena(scanner, "Introduzca su contraseña");
            
            // Verificar contraseña
            if (!empleado.getPassword().equals(password)) {
                throw EmpleadoException.passwordIncorrecto();
            }
            
            // Login exitoso
            empleadoActual = empleado;
            System.out.println("Bienvenido/a, " + empleado.getNombre() + "!");
            return true;
            
        } catch (EmpleadoException e) {
            System.out.println("Error " + e.getCodigo() + ": " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Busca un empleado por su código
     * @param codigo Código del empleado a buscar
     * @return Empleado encontrado o null si no existe
     */
    private Empleado buscarEmpleadoPorCodigo(int codigo) {
        for (int i = 0; i < numEmpleados; i++) {
            if (empleados[i].getCodigo() == codigo) {
                return empleados[i];
            }
        }
        return null;
    }
    
    /**
     * Cambia la contraseña del empleado actual
     * @param scanner Scanner para leer entrada del usuario
     * @return true si el cambio fue exitoso, false en caso contrario
     */
    public boolean cambiarPassword(Scanner scanner) {
        if (empleadoActual == null) {
            System.out.println("No hay ningún empleado con sesión iniciada.");
            return false;
        }
        
        System.out.println("\n=== CAMBIAR CONTRASEÑA ===");
        
        // Solicitar contraseña actual
        String passwordActual = Validador.solicitarCadena(scanner, "Introduzca su contraseña actual");
        
        // Verificar contraseña actual
        if (!empleadoActual.getPassword().equals(passwordActual)) {
            System.out.println("Error: La contraseña actual no es correcta.");
            return false;
        }
        
        // Solicitar nueva contraseña
        String nuevaPassword = Validador.solicitarCadena(scanner, "Introduzca la nueva contraseña");
        
        // Confirmar nueva contraseña
        String confirmacion = Validador.solicitarCadena(scanner, "Confirme la nueva contraseña");
        
        if (!nuevaPassword.equals(confirmacion)) {
            System.out.println("Error: Las contraseñas no coinciden.");
            return false;
        }
        
        // Cambiar contraseña
        empleadoActual = buscarEmpleadoPorCodigo(empleadoActual.getCodigo());
        if (empleadoActual != null) {
            this.setPassword(empleadoActual, nuevaPassword);
            System.out.println("Contraseña cambiada con éxito.");
            return true;
        }
        
        return false;
    }
    
    /**
     * Cierra la sesión del empleado actual
     */
    public void cerrarSesion() {
        if (empleadoActual != null) {
            System.out.println("Sesión cerrada para " + empleadoActual.getNombre() + ".");
            empleadoActual = null;
        }
    }
    
    /**
     * Obtiene el empleado con sesión iniciada
     * @return Empleado actual o null si no hay sesión
     */
    public Empleado getEmpleadoActual() {
        return empleadoActual;
    }
    
    /**
     * Establece la contraseña de un empleado
     * @param empleado Empleado a modificar
     * @param password Nueva contraseña
     */
    private void setPassword(Empleado empleado, String password) {
        if (empleado instanceof EmpleadoDiurno) {
            EmpleadoDiurno diurno = (EmpleadoDiurno) empleado;
            diurno = new EmpleadoDiurno(
                diurno.getCodigo(),
                diurno.getNombre(),
                password,
                diurno.getNivel(),
                diurno.getRetencion()
            );
            
            // Actualizar en el array
            for (int i = 0; i < numEmpleados; i++) {
                if (empleados[i].getCodigo() == diurno.getCodigo()) {
                    empleados[i] = diurno;
                    break;
                }
            }
            
            if (empleadoActual != null && empleadoActual.getCodigo() == diurno.getCodigo()) {
                empleadoActual = diurno;
            }
        } else if (empleado instanceof EmpleadoNocturno) {
            EmpleadoNocturno nocturno = (EmpleadoNocturno) empleado;
            nocturno = new EmpleadoNocturno(
                nocturno.getCodigo(),
                nocturno.getNombre(),
                password,
                nocturno.getNivel(),
                nocturno.getPlusNocturnidad()
            );
            
            // Actualizar en el array
            for (int i = 0; i < numEmpleados; i++) {
                if (empleados[i].getCodigo() == nocturno.getCodigo()) {
                    empleados[i] = nocturno;
                    break;
                }
            }
            
            if (empleadoActual != null && empleadoActual.getCodigo() == nocturno.getCodigo()) {
                empleadoActual = nocturno;
            }
        }
    }
}