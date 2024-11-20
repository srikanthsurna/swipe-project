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
import { updateCustomer } from "../features/customersSlice";

function CustomersTab() {
  const customers = useSelector((state) => state.customers.items);
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm(customer);
  };

  const handleSave = () => {
    dispatch(updateCustomer(editForm));
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
            <TableCell>Customer Name</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Total Purchase Amount</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              {editingId === customer.id ? (
                <>
                  <TableCell>
                    <TextField
                      value={editForm.name}
                      onChange={(e) => handleChange(e, "name")}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={editForm.phoneNumber}
                      onChange={(e) => handleChange(e, "phoneNumber")}
                    />
                  </TableCell>
                  <TableCell>{customer.totalPurchaseAmount}</TableCell>
                  <TableCell>
                    <TextField
                      value={editForm.email}
                      onChange={(e) => handleChange(e, "email")}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={editForm.address}
                      onChange={(e) => handleChange(e, "address")}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleSave}>
                      <SaveIcon />
                    </IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                  <TableCell>{customer.totalPurchaseAmount}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(customer)}>
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

export default CustomersTab;
