const sqlite3 = require("sqlite3").verbose();
const fs = require('fs');

// Ensure the database file is writable
const dbPath = "./punto_venta.db";
fs.chmodSync(dbPath, 0o666);

// Crear o abrir la base de datos
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error("Error al abrir la base de datos:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
  }
});

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL
      )
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        codigo TEXT NOT NULL
      )
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        cliente_id INTEGER NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      )
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS item_ventas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venta_id INTEGER NOT NULL,
        producto_id INTEGER NOT NULL,
        cantidad INTEGER NOT NULL,
        FOREIGN KEY (venta_id) REFERENCES ventas(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
      )
    `);
});

module.exports = db;
