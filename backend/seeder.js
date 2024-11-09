const fs = require('fs');
const db = require('./database');

async function seedDatabase() {
  const connection = await db.getConnection();
  try {
    const productos = fs.readFileSync('./seeder/productos.json').toString();
    const productosArray = JSON.parse(productos);

    const clientes = fs.readFileSync('./seeder/clientes.json').toString();
    const clientesArray = JSON.parse(clientes);

    await connection.query('DELETE FROM productos');
    for (const producto of productosArray) {
      await connection.query(`
        INSERT INTO productos (nombre, precio, codigo)
        VALUES (?, ?, ?)
      `, [producto.nombre, producto.precio, producto.codigo]);
    }

    await connection.query('DELETE FROM clientes');
    for (const cliente of clientesArray) {
      await connection.query(`
        INSERT INTO clientes (nombre)
        VALUES (?)
      `, [cliente.nombre]);
    }
  } finally {
    connection.release();
  }
}

seedDatabase().catch(err => {
  console.error("Error al sembrar la base de datos:", err.message);
});