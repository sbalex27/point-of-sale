import React, { useState } from 'react';
import ProductTable from './components/ProductTable';
import Cart from './components/Cart';
import SearchBar from './components/SearchBar';
import { Container, Grid } from '@mui/material';

const App = () => {
  const [products] = useState([
    { stock: 35, name: "Eos dolor quia tempora est illo.", code: "63391084", value: 490.96 },
    { stock: 17, name: "Voluptatem hic et rerum rerum cupiditate aut.", code: "78183711", value: 100.99 },
    { stock: 54, name: "Maiores voluptatem quis et.", code: "09844995", value: 149.11 },
    { stock: 29, name: "Quas ut aliquid consequatur minus.", code: "09469242", value: 990.69 },
    { stock: 90, name: "Molestiae odio a repellat et.", code: "00294614", value: 569.37 },
    { stock: 23, name: "Sit ipsum qui sit vero.", code: "96038444", value: 826.13 },
    { stock: 82, name: "Sed explicabo voluptate et et dignissimos ex.", code: "38794988", value: 658.65 },
    { stock: 36, name: "Est consequatur sint natus occaecati non voluptatem vel et.", code: "11717348", value: 649.75 },
    { stock: 38, name: "Eaque iusto quia cupiditate sunt voluptas.", code: "21906008", value: 193.71 },
    { stock: 93, name: "Est dolores velit ut earum ad.", code: "27550885", value: 711.14 }
  ]);

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product) => {
    const exist = cart.find(item => item.code === product.code);
    if (exist) {
      setCart(cart.map(item =>
        item.code === product.code ? { ...exist, quantity: exist.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ paddingTop: '20px' }}>
      <SearchBar setSearchTerm={setSearchTerm} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ProductTable products={filteredProducts} addToCart={addToCart} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Cart cart={cart} setCart={setCart} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
