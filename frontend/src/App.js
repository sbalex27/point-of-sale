import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductTable from './components/ProductTable';
import Cart from './components/Cart';
import SearchBar from './components/SearchBar';
import { Container, Grid, Box } from '@mui/material';

// Añadimos debounce para mejorar la performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const App = () => {
  const [products, setProducts] = useState([]);  // Estado para productos
  const [cart, setCart] = useState([]);  // Estado para el carrito
  const [searchTerm, setSearchTerm] = useState('');  // Estado para el término de búsqueda
  const [error, setError] = useState(null);  // Estado para manejar errores

  // Usamos el debounce para esperar un poco antes de hacer la petición
  const debouncedSearchTerm = useDebounce(searchTerm, 300);  // Espera 300ms

  // Petición al backend para obtener productos según el término de búsqueda
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/productos?codigo=${debouncedSearchTerm}`);
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
        console.error(err);
      }
    };

    // Solo hacer la petición si el searchTerm no está vacío
    if (debouncedSearchTerm) {
      fetchProducts();
    } else {
      setProducts([]);  // Si no hay búsqueda, reseteamos la lista
    }
  }, [debouncedSearchTerm]);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    const exist = cart.find(item => item.codigo === product.codigo);
    if (exist) {
      setCart(cart.map(item =>
        item.codigo === product.codigo ? { ...exist, quantity: exist.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Si hay error, mostramos el mensaje
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
      <Grid container spacing={3}>
        {/* Barra de búsqueda */}
        <Grid item xs={12}>
          <SearchBar setSearchTerm={setSearchTerm} />
        </Grid>
        
        {/* Tabla de productos */}
        <Grid item xs={12} md={8}>
          <ProductTable products={products} addToCart={addToCart} />
        </Grid>
        
        {/* Barra lateral con el carrito */}
        <Grid item xs={12} md={4}>
          <Cart cart={cart} setCart={setCart} />  {/* Cart pasa a ser parte del layout */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
