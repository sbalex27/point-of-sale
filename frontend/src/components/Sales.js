import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState(null);

  // Petición al backend para obtener las ventas
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get('http://localhost:3001/ventas');
        setSales(response.data);
      } catch (err) {
        setError('Error fetching sales');
        console.error(err);
      }
    };

    fetchSales();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <TableContainer component={Paper} sx={{ marginTop: '20px', borderRadius: '8px' }}>
      <Typography variant="h6" gutterBottom>Sales History</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID Venta</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Productos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>{sale.cliente_id}</TableCell>
              <TableCell>{new Date(sale.fecha).toLocaleDateString()}</TableCell>
              <TableCell>
                {sale.productos.map((producto) => (
                  <div key={producto.id}>
                    {producto.nombre} - Cantidad: {producto.cantidad}
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Sales;
