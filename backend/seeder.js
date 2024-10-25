const fs = require('fs');

// Borrar la base de datos
fs.unlink("./punto_venta.db", (err) => {
  if (err) {
    console.error("Error al borrar la base de datos:", err.message);
  } else {
    console.log("Base de datos borrada.");
  }
});

const db = require('./database');

const productos = fs.readFileSync('./seeder/productos.json').toString();
const productosArray = JSON.parse(productos);

const clientes = fs.readFileSync('./seeder/clientes.json').toString();
const clientesArray = JSON.parse(clientes);

db.serialize(() => {
  db.run('DELETE FROM productos');

  productosArray.forEach(producto => {
    db.run(`
      INSERT INTO productos (nombre, precio, codigo)
      VALUES (?, ?, ?)
    `, [producto.nombre, producto.precio, producto.codigo]);
  });

  db.run('DELETE FROM clientes');
  clientesArray.forEach(cliente => {
    db.run(`
      INSERT INTO clientes (nombre)
      VALUES (?)
    `, [cliente.nombre]);
  });
});

// Desconectar de la base de datos
db.close((err) => {
  if (err) {
    console.error("Error al cerrar la base de datos:", err.message);
  } else {
    console.log("Desconectado de la base de datos SQLite.");
  }
});