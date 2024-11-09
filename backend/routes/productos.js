const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  const { codigo } = req.query;
  try {
    const [rows] = await db.query('SELECT * FROM productos WHERE codigo LIKE ?', [`%${codigo}%`]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para crear un producto
router.post('/', async (req, res) => {
  const { nombre, precio } = req.body;
  try {
    const [result] = await db.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
    res.json({ producto_id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;