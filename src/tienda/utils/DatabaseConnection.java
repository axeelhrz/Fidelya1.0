package tienda.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Clase utilitaria para gestionar la conexión a la base de datos.
 * Proporciona métodos estáticos para abrir y cerrar conexiones.
 */
public class DatabaseConnection {
    // Constantes de conexión
    private static final String URL = "jdbc:mysql://localhost:3306/tienda?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "Missifu2565711-9"; // Cambia esto a tu contraseña real
    
    static {
        try {
            // Cargar el driver explícitamente
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("Driver JDBC cargado correctamente.");
        } catch (ClassNotFoundException e) {
            System.err.println("Error al cargar el driver JDBC: " + e.getMessage());
        }
    }
    
    /**
     * Obtiene una conexión a la base de datos
     * @return Conexión a la base de datos
     * @throws SQLException Si hay un error al conectar
     */
    public static Connection getConnection() throws SQLException {
            try {
            System.out.println("Intentando conectar a: " + URL);
            Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
            System.out.println("Conexión establecida correctamente.");
            return conn;
            } catch (SQLException e) {
            System.err.println("Error al conectar a la base de datos: " + e.getMessage());
            throw e;
        }
    }
    
    /**
     * Cierra una conexión a la base de datos
     * @param conn Conexión a cerrar
     */
    public static void close(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                System.err.println("Error al cerrar la conexión: " + e.getMessage());
    }
}
    }
    
    /**
     * Cierra un PreparedStatement
     * @param stmt PreparedStatement a cerrar
     */
    public static void close(PreparedStatement stmt) {
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException e) {
                System.err.println("Error al cerrar el statement: " + e.getMessage());
            }
        }
    }
    
    /**
     * Cierra un ResultSet
     * @param rs ResultSet a cerrar
     */
    public static void close(ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException e) {
                System.err.println("Error al cerrar el resultset: " + e.getMessage());
            }
        }
    }
    
    /**
     * Cierra todos los recursos de base de datos
     * @param conn Conexión a cerrar
     * @param stmt PreparedStatement a cerrar
     * @param rs ResultSet a cerrar
     */
    public static void close(Connection conn, PreparedStatement stmt, ResultSet rs) {
        close(rs);
        close(stmt);
        close(conn);
    }
}