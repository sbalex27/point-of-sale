const express = require("express");
const router = express.Router();
const db = require("../database");

router.post("/", (req, res) => {
  const { cliente_id, productos } = req.body;

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    // debugger
    db.run(
      "INSERT INTO ventas (cliente_id, fecha) VALUES (?, ?)",
      [cliente_id, new Date().toISOString()],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          res.status(400).json({ error: err.message });
          return;
        }
        const venta_id = this.lastID;

        const placeholders = productos
          .map((producto) => "(?, ?, ?)")
          .join(", ");
        const params = productos.reduce((acc, producto) => {
          acc.push(venta_id);
          acc.push(producto.id);
          acc.push(producto.cantidad);
          return acc;
        }, []);

        db.run(
          `INSERT INTO item_ventas (venta_id, producto_id, cantidad) VALUES ${placeholders}`,
          params,
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              res.status(400).json({ error: err.message });
              return;
            }

            db.run("COMMIT", (err) => {
              if (err) {
                res
                  .status(400)
                  .json({ error: "Error al confirmar la transacción" });
                return;
              }
              res.json({ venta_id, mensaje: "Venta procesada exitosamente!" });
            });
          }
        );
      }
    );
  });
});

router.get("/", (req, res) => {
  const query =
    "SELECT * FROM ventas LEFT JOIN item_ventas ON ventas.id = item_ventas.venta_id LEFT JOIN productos ON item_ventas.producto_id = productos.id";

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

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
  });
});

module.exports = router;
