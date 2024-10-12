const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();

// Crear o abrir la base de datos
const db = new sqlite3.Database('./punto_venta.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

const productos = fs.readFileSync('./seeder/productos.json').toString();
const productosArray = JSON.parse(productos);

db.serialize(() => {
  db.run('DELETE FROM productos');

  productosArray.forEach(producto => {
    db.run(`
      INSERT INTO productos (nombre, precio, codigo)
      VALUES (?, ?, ?)
    `, [producto.nombre, producto.precio, producto.codigo]);
  });
});
