const express = require("express");
const router = express.Router();
const db = require("../database");

router.post("/", async (req, res) => {
  const { cliente_id, productos } = req.body;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO ventas (cliente_id, fecha) VALUES (?, ?)",
      [cliente_id, new Date()]
    );
    const venta_id = result.insertId;

    const placeholders = productos.map(() => "(?, ?, ?)").join(", ");
    const params = productos.reduce((acc, producto) => {
      acc.push(venta_id, producto.id, producto.cantidad);
      return acc;
    }, []);

    console.table(placeholders);

    await connection.query(
      `INSERT INTO item_ventas (venta_id, producto_id, cantidad) VALUES ${placeholders}`,
      params
    );

    await connection.commit();
    res.json({ venta_id, mensaje: "Venta procesada exitosamente!" });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ error: err.message });
  } finally {
    connection.release();
  }
});

router.get("/", async (req, res) => {
  const query =
    "SELECT * FROM ventas LEFT JOIN item_ventas ON ventas.id = item_ventas.venta_id LEFT JOIN productos ON item_ventas.producto_id = productos.id";

  try {
    const [rows] = await db.query(query);

    const ventas = rows.reduce((acc, row) => {
      let venta = acc.find((v) => v.id === row.venta_id);
      if (!venta) {
        venta = {
          id: row.venta_id,
          cliente_id: row.cliente_id,
          fecha: row.fecha,
          productos: [],
        };
        acc.push(venta);
      }
      if (row.producto_id) {
        venta.productos.push({
          id: row.producto_id,
          nombre: row.nombre,
          precio: row.precio,
          cantidad: row.cantidad,
        });
      }
      return acc;
    }, []);

    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
