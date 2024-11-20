import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

function InvoicesTab() {
  const invoices = useSelector((state) => state.invoices.items);

  useEffect(() => {
    console.log("Current invoices:", invoices);
  }, [invoices]);

  if (!invoices || invoices.length === 0) {
    return (
      <Typography variant="h6" sx={{ p: 2, textAlign: "center" }}>
        No invoices available. Please upload some files.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Serial Number</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Tax</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={invoice.serialNumber || index}>
              <TableCell>{invoice.serialNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{invoice.productName}</TableCell>
              <TableCell>{invoice.quantity}</TableCell>
              <TableCell>{invoice.tax}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
              <TableCell>{invoice.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InvoicesTab;
