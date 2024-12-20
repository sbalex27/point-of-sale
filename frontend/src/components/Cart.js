import React from 'react';
import { List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';
import axios from 'axios';  // Importamos Axios para las peticiones HTTP

const Cart = ({ cart, setCart, handleSell }) => {
  const updateQuantity = (product, delta) => {
    const updatedCart = cart.map(item =>
      item.codigo === product.codigo
        ? { ...item, quantity: item.quantity + delta }
        : item
    ).filter(item => item.quantity > 0);  // Remover del carrito si la cantidad es 0
    setCart(updatedCart);
  };

  // Calculamos el total del carrito
  const total = cart.reduce((acc, product) => acc + product.precio * product.quantity, 0);

  return (
    <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>Cart</Typography>
      <List>
        {cart.length > 0 ? (
          cart.map(item => (
            <ListItem key={item.codigo} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={`${item.nombre} - $${item.precio} x ${item.quantity}`} />
              <Box>
                <Button 
                  variant="contained" 
                  onClick={() => updateQuantity(item, -1)} 
                  size="small" 
                  color="secondary">
                  -
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => updateQuantity(item, 1)} 
                  size="small" 
                  color="primary">
                  +
                </Button>
              </Box>
            </ListItem>
          ))
        ) : (
          <Typography variant="body1">No items in the cart</Typography>
        )}
      </List>
      <Typography variant="h6" gutterBottom>Total: ${total}</Typography>
      <Button variant="contained" color="success" fullWidth onClick={handleSell}>Sell</Button>
    </Box>
  );
};

export default Cart;
