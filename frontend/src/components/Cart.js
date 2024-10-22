import React from 'react';
import { List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';

const Cart = ({ cart, setCart }) => {
  const updateQuantity = (product, delta) => {
    const updatedCart = cart.map(item =>
      item.code === product.code
        ? { ...item, quantity: item.quantity + delta }
        : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
  };

  const total = cart.reduce((acc, product) => acc + product.value * product.quantity, 0);

  return (
    <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>Cart</Typography>
      <List>
        {cart.map(item => (
          <ListItem key={item.code} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={`${item.name} - $${item.value.toFixed(2)} x ${item.quantity}`} />
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
        ))}
      </List>
      <Typography variant="h6" gutterBottom>Total: ${total.toFixed(2)}</Typography>
      <Button variant="contained" color="success" fullWidth>Sell</Button>
    </Box>
  );
};

export default Cart;
