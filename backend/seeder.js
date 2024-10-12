const fs = require('fs');
const db = require('./database');

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
