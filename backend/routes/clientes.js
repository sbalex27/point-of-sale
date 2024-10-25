const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta para obtener todos los clientes
router.get('/', (req, res) => {
  db.all('SELECT * FROM clientes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Ruta para crear un cliente
router.post('/', (req, res) => {
  const { nombre, email } = req.body;
  db.run('INSERT INTO clientes (nombre, email) VALUES (?, ?)', [nombre, email], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ cliente_id: this.lastID });
  });
});

module.exports = router;