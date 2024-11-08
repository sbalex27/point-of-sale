import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductTable from "./components/ProductTable";
import Cart from "./components/Cart";
import SearchBar from "./components/SearchBar";
import { Container, Grid, Box } from "@mui/material";

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
  const [products, setProducts] = useState([]); // Estado para productos
  const [cart, setCart] = useState([]); // Estado para el carrito
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [error, setError] = useState(null); // Estado para manejar errores
  const [barcode, setBarcode] = useState("");

  // Usamos el debounce para esperar un poco antes de hacer la petición
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Espera 300ms

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/productos?codigo=${debouncedSearchTerm}`
      );
      setProducts(response.data);
    } catch (err) {
      setError("Error fetching products");
      console.error(err);
    }
  };

  // Petición al backend para obtener productos según el término de búsqueda
  useEffect(() => {
    // Solo hacer la petición si el searchTerm no está vacío
    if (debouncedSearchTerm) {
      fetchProducts();
    } else {
      setProducts([]); // Si no hay búsqueda, reseteamos la lista
    }
  }, [debouncedSearchTerm]);

  // Función para agregar productos al carrito
  const addToCart = (product) => {
    const exist = cart.find((item) => item.codigo === product.codigo);
    if (exist) {
      setCart(
        cart.map((item) =>
          item.codigo === product.codigo
            ? { ...exist, quantity: exist.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      setBarcode("");
    }
  };

  useEffect(() => {
    // Listener para capturar la entrada del teclado
    const handleKeyPress = (e) => {
      setBarcode((prev) => prev + e.key);
    };

    // Agrega el evento para capturar teclas
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      // Limpia el listener al desmontar el componente
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const barcodeOnlyNumbers = barcode.replace(/\D/g, "");
    // Ejecuta la acción cuando el código tiene una longitud de 2 caracteres o más
    if (barcodeOnlyNumbers.length >= 13) {
      // Aquí puedes realizar la acción deseada
      console.log("Código detectado:", barcodeOnlyNumbers);

      const idCliente = '4005566778895'; // TODO: Parametrizar esto

      if (idCliente === barcodeOnlyNumbers) {
        handleSell();
      }

      // Busca el producto en la base de datos
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/productos?codigo=${barcodeOnlyNumbers}`
          );
          if (response.data.length > 0) {
            addToCart(response.data[0]);
          } else {
            console.log("Producto no encontrado");
          }
        } catch (err) {
          setError("Error fetching products");
          console.error(err);
        }
      };

      fetchProduct();
      // Limpia el código después de realizar la acción (opcional)
      setBarcode("");
      setSearchTerm("");
    }
  }, [barcode]);

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

  // Si hay error, mostramos el mensaje
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container maxWidth="lg" sx={{ paddingTop: "20px" }}>
      <Grid container spacing={3}>
        {/* Barra de búsqueda */}
        <Grid item xs={12}>
          <SearchBar setSearchTerm={setSearchTerm} searchTem={searchTerm} />
        </Grid>

        {/* Tabla de productos */}
        <Grid item xs={12} md={8}>
          <ProductTable products={products} addToCart={addToCart} />
        </Grid>

        {/* Barra lateral con el carrito */}
        <Grid item xs={12} md={4}>
          <Cart cart={cart} setCart={setCart} handleSell={handleSell} />
          {" "}
          {/* Cart pasa a ser parte del layout */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
