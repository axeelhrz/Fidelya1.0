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
            System.out.println("Conectando a la base de datos...");
            conn = DatabaseConnection.getConnection();
            System.out.println("Conexión exitosa.");
            
            // Verificar si la tabla empleados existe
            System.out.println("Verificando tabla empleados...");
            stmt = conn.prepareStatement("SHOW TABLES LIKE 'empleados'");
            rs = stmt.executeQuery();
            if (rs.next()) {
                System.out.println("La tabla empleados existe.");
            } else {
                System.out.println("La tabla empleados NO existe.");
                return;
            }
            
            // Verificar si hay datos en la tabla empleados
            rs.close();
            stmt.close();
            stmt = conn.prepareStatement("SELECT COUNT(*) FROM empleados");
            rs = stmt.executeQuery();
            if (rs.next()) {
                int count = rs.getInt(1);
                System.out.println("La tabla empleados tiene " + count + " registros.");
            }
            
            // Mostrar los empleados
            rs.close();
            stmt.close();
            stmt = conn.prepareStatement("SELECT * FROM empleados");
            rs = stmt.executeQuery();
            System.out.println("\nEmpleados en la base de datos:");
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
            
        } catch (SQLException e) {
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}