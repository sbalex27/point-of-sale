const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
  db.all('SELECT * FROM productos', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ productos: rows });
  });
});

// Ruta para crear un producto
router.post('/', (req, res) => {
  const { nombre, precio } = req.body;
  db.run('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ producto_id: this.lastID });
  });
});

module.exports = router;