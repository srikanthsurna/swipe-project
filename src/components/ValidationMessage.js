import React from 'react';
import { Alert, Box } from '@mui/material';

function ValidationMessage({ errors }) {
  if (!errors || errors.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      {errors.map((error, index) => (
        <Alert key={index} severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      ))}
    </Box>
  );
}

export default ValidationMessage; 