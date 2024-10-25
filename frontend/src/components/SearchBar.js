import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ setSearchTerm }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <TextField
        label="Search products..."
        variant="outlined"
        fullWidth
        onChange={(e) => setSearchTerm(e.target.value)}  // Actualiza el término de búsqueda
      />
    </div>
  );
};

export default SearchBar;
