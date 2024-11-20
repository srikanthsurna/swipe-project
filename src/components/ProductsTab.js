import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { updateProduct } from "../features/productsSlice";

function ProductsTab() {
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const handleSave = () => {
    dispatch(updateProduct(editForm));
    setEditingId(null);
  };

  const handleChange = (e, field) => {
    setEditForm({
      ...editForm,
      [field]: e.target.value,
    });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Price</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Price with Tax</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              {editingId === product.id ? (
                <>
                  <TableCell>
                    <TextField
                      value={editForm.name}
                      onChange={(e) => handleChange(e, "name")}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={editForm.quantity}
                      onChange={(e) => handleChange(e, "quantity")}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={editForm.unitPrice}
                      onChange={(e) => handleChange(e, "unitPrice")}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={editForm.tax}
                      onChange={(e) => handleChange(e, "tax")}
                    />
                  </TableCell>
                  <TableCell>
                    {(editForm.unitPrice * (1 + editForm.tax / 100)).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleSave}>
                      <SaveIcon />
                    </IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unitPrice}</TableCell>
                  <TableCell>{product.tax}%</TableCell>
                  <TableCell>
                    {(product.unitPrice * (1 + product.tax / 100)).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(product)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ProductsTab;
