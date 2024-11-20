import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Box,
  CircularProgress,
  Alert,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  extractDataFromFile,
  validateExtractedData,
} from "../services/aiService";
import { addInvoice } from "../features/invoicesSlice";
import { addProduct } from "../features/productsSlice";
import { addCustomer } from "../features/customersSlice";

// Add this constant at the top of your file, outside of any component
const SUPPORTED_MIMETYPES = [
  "application/pdf",
  "text/plain",
  "text/csv",
  // Excel files
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  // Image files
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

function FileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const dispatch = useDispatch();

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setValidationErrors([]);

    try {
      for (let file of files) {
        console.log("Processing file:", file.name, "Type:", file.type);

        if (!SUPPORTED_MIMETYPES.includes(file.type)) {
          throw new Error(
            `Unsupported file type: ${file.type}. Please upload a supported file type.`
          );
        }

        try {
          const extractedData = await extractDataFromFile(file);
          console.log("Extracted data:", extractedData);

          if (extractedData) {
            const timestamp = Date.now();

            if (extractedData.invoice) {
              dispatch(
                addInvoice({
                  ...extractedData.invoice,
                  id: `inv-${timestamp}`,
                })
              );
            }

            if (extractedData.product) {
              dispatch(
                addProduct({
                  ...extractedData.product,
                  id: `prod-${timestamp}`,
                })
              );
            }

            if (extractedData.customer) {
              dispatch(
                addCustomer({
                  ...extractedData.customer,
                  id: `cust-${timestamp}`,
                })
              );
            }

            setSuccess(true);
          }
        } catch (processError) {
          console.error(`Error processing ${file.name}:`, processError);
          setError(`Error processing ${file.name}: ${processError.message}`);
          // Continue with next file instead of stopping completely
          continue;
        }
      }
    } catch (err) {
      console.error("Error processing files:", err);
      setError(err.message || "Failed to process files. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Upload Invoices
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Supported formats:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="Images"
              secondary="JPEG, PNG, WebP, HEIC/HEIF"
            />
          </ListItem>
          <ListItem>
            <ListItemText primary="Documents" secondary="PDF" />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Spreadsheets"
              secondary="Excel (XLS, XLSX, ODS)"
            />
          </ListItem>
        </List>
      </Box>

      <input
        accept={Object.values(SUPPORTED_MIMETYPES).join(",")}
        style={{ display: "none" }}
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileUpload}
      />
      <label htmlFor="file-upload">
        <Button variant="contained" component="span" disabled={loading}>
          {loading ? "Processing..." : "Upload Files"}
          {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
        </Button>
      </label>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Files processed successfully
        </Alert>
      )}
    </Box>
  );
}

export default FileUpload;
