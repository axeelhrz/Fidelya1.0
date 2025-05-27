package tienda.utils;

import java.util.Scanner;

/**
 * Clase de utilidad para validar entradas del usuario.
 */
public class Validador {
    
    /**
     * Valida que un número entero esté dentro de un rango
     * @param valor Valor a validar
     * @param min Valor mínimo permitido
     * @param max Valor máximo permitido
     * @return true si el valor está en el rango, false en caso contrario
     */
    public static boolean validarRango(int valor, int min, int max) {
        return valor >= min && valor <= max;
}

    /**
     * Valida que un valor double sea positivo
     * @param valor Valor a validar
     * @return true si el valor es positivo, false en caso contrario
     */
    public static boolean validarPositivo(double valor) {
        return valor > 0;
    }
    
    /**
     * Solicita un entero al usuario con validación de rango
     * @param scanner Scanner para leer la entrada
     * @param mensaje Mensaje a mostrar al usuario
     * @param min Valor mínimo permitido
     * @param max Valor máximo permitido
     * @return Entero validado
     */
    public static int solicitarEntero(Scanner scanner, String mensaje, int min, int max) {
        int valor;
        boolean valido = false;
        
        do {
            System.out.print(mensaje + " (" + min + "-" + max + "): ");
            try {
                valor = Integer.parseInt(scanner.nextLine());
                valido = validarRango(valor, min, max);
                if (!valido) {
                    System.out.println("Error: El valor debe estar entre " + min + " y " + max);
                }
            } catch (NumberFormatException e) {
                System.out.println("Error: Debe introducir un número entero válido");
                valor = min - 1; // Valor inválido para continuar el bucle
            }
        } while (!valido);
        
        return valor;
    }
    
    /**
     * Solicita un double al usuario con validación de valor positivo
     * @param scanner Scanner para leer la entrada
     * @param mensaje Mensaje a mostrar al usuario
     * @return Double validado (positivo)
     */
    public static double solicitarDouble(Scanner scanner, String mensaje) {
        double valor;
        boolean valido = false;
        
        do {
            System.out.print(mensaje + " (valor positivo): ");
            try {
                valor = Double.parseDouble(scanner.nextLine());
                valido = validarPositivo(valor);
                if (!valido) {
                    System.out.println("Error: El valor debe ser positivo");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error: Debe introducir un número válido");
                valor = -1; // Valor inválido para continuar el bucle
            }
        } while (!valido);
        
        return valor;
    }
    
    /**
     * Solicita una cadena no vacía al usuario
     * @param scanner Scanner para leer la entrada
     * @param mensaje Mensaje a mostrar al usuario
     * @return Cadena validada (no vacía)
     */
    public static String solicitarCadena(Scanner scanner, String mensaje) {
        String valor;
        boolean valido = false;
        
        do {
            System.out.print(mensaje + ": ");
            valor = scanner.nextLine().trim();
            valido = !valor.isEmpty();
            if (!valido) {
                System.out.println("Error: La cadena no puede estar vacía");
            }
        } while (!valido);
        
        return valor;
    }
    
    /**
     * Solicita confirmación al usuario (S/N)
     * @param scanner Scanner para leer la entrada
     * @param mensaje Mensaje a mostrar al usuario
     * @return true si confirma (S), false en caso contrario (N)
     */
    public static boolean confirmar(Scanner scanner, String mensaje) {
        String respuesta;
        do {
            System.out.print(mensaje + " (S/N): ");
            respuesta = scanner.nextLine().trim().toUpperCase();
        } while (!respuesta.equals("S") && !respuesta.equals("N"));
        
        return respuesta.equals("S");
    }
}