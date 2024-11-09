import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const ProductTable = ({ products, addToCart }) => {
  return (
    <TableContainer component={Paper} sx={{ marginTop: '20px', borderRadius: '8px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Code</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.codigo}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{product.nombre}</TableCell>
              <TableCell>{product.codigo}</TableCell>
              <TableCell>${product.precio}</TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
