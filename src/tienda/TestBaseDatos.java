package tienda;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import tienda.utils.DatabaseConnection;

public class TestBaseDatos {
    public static void main(String[] args) {
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;
        
        try {
            System.out.println("=== TEST DE CONEXIÓN A LA BASE DE DATOS ===");
            System.out.println("Conectando a la base de datos...");
            conn = DatabaseConnection.getConnection();
            System.out.println("Conexión exitosa.");
            
            // Verificar si la base de datos existe
            System.out.println("\n=== INFORMACIÓN DE LA BASE DE DATOS ===");
            System.out.println("URL: " + conn.getMetaData().getURL());
            System.out.println("Usuario: " + conn.getMetaData().getUserName());
            System.out.println("Versión de MySQL: " + conn.getMetaData().getDatabaseProductVersion());
            
            // Verificar si la tabla empleados existe
            System.out.println("\n=== VERIFICACIÓN DE TABLAS ===");
            stmt = conn.prepareStatement("SHOW TABLES");
            rs = stmt.executeQuery();
            System.out.println("Tablas en la base de datos:");
            while (rs.next()) {
                System.out.println("- " + rs.getString(1));
            }
            
            // Verificar si hay datos en la tabla empleados
            rs.close();
            stmt.close();
            stmt = conn.prepareStatement("SELECT COUNT(*) FROM empleados");
            rs = stmt.executeQuery();
            if (rs.next()) {
                int count = rs.getInt(1);
                System.out.println("\nLa tabla empleados tiene " + count + " registros.");
            }
            
            // Mostrar los empleados
            rs.close();
            stmt.close();
            stmt = conn.prepareStatement("SELECT * FROM empleados");
            rs = stmt.executeQuery();
            System.out.println("\n=== EMPLEADOS EN LA BASE DE DATOS ===");
            System.out.println("ID | Nombre | Password | Nivel | Turno");
            System.out.println("----------------------------------");
            while (rs.next()) {
                System.out.println(
                    rs.getInt("id_empleado") + " | " +
                    rs.getString("nombre") + " | " +
                    rs.getString("password") + " | " +
                    rs.getInt("nivel") + " | " +
                    rs.getString("turno")
                );
            }
            
            System.out.println("\n=== TEST COMPLETADO CON ÉXITO ===");
            
        } catch (SQLException e) {
            System.out.println("\n=== ERROR DE BASE DE DATOS ===");
            System.out.println("Mensaje: " + e.getMessage());
            System.out.println("Código SQL: " + e.getSQLState());
            System.out.println("Código de error: " + e.getErrorCode());
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
                System.out.println("\nRecursos cerrados correctamente.");
            } catch (SQLException e) {
                System.out.println("Error al cerrar recursos: " + e.getMessage());
            }
        }
    }
}