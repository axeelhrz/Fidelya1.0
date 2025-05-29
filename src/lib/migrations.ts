export const runMigrations = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Crear tabla de migraciones
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Lista de migraciones
    const migrations = [
      'add_image_url_to_products',
      'add_allergens_to_products'
    ];
    
    for (const migration of migrations) {
      const [existing]: any = await connection.execute(
        'SELECT * FROM migrations WHERE name = ?',
        [migration]
      );
      
      if (existing.length === 0) {
        await runMigration(connection, migration);
        await connection.execute(
          'INSERT INTO migrations (name) VALUES (?)',
          [migration]
        );
      }
    }
  } finally {
    connection.release();
  }
};