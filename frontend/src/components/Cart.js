import React from 'react';
import { List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';
import axios from 'axios';  // Importamos Axios para las peticiones HTTP

const Cart = ({ cart, setCart }) => {
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

  // Función para procesar la venta
  const handleSell = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    try {
      // Lógica para registrar la venta
      const response = await axios.post('http://localhost:3001/ventas', {
        cliente_id: 1,  // Este es un valor fijo de ejemplo. Puedes modificarlo para recibirlo del usuario.
        productos: cart.map(item => ({
          id: item.codigo,
          cantidad: item.quantity
        }))
      });

      // Mostramos mensaje de éxito y limpiamos el carrito
      alert(response.data.mensaje);
      setCart([]);  // Limpiamos el carrito después de la venta

    } catch (error) {
      console.error('Error procesando la venta:', error);
      alert('Error procesando la venta');
    }
  };

  return (
    <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px' }}>
      <Typography variant="h6" gutterBottom>Cart</Typography>
      <List>
        {cart.length > 0 ? (
          cart.map(item => (
            <ListItem key={item.codigo} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={`${item.nombre} - $${item.precio.toFixed(2)} x ${item.quantity}`} />
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
      <Typography variant="h6" gutterBottom>Total: ${total.toFixed(2)}</Typography>
      <Button variant="contained" color="success" fullWidth onClick={handleSell}>Sell</Button>
    </Box>
  );
};

export default Cart;
