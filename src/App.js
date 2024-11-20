import React, { useState } from "react";
import { Box, Tab, Tabs, Container } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import FileUpload from "./components/FileUpload";
import InvoicesTab from "./components/InvoicesTab";
import ProductsTab from "./components/ProductsTab";
import CustomersTab from "./components/CustomersTab";

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="lg">
        <Box sx={{ width: "100%", mt: 4 }}>
          <FileUpload />

          <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 3 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Invoices" />
              <Tab label="Products" />
              <Tab label="Customers" />
            </Tabs>
          </Box>

          {currentTab === 0 && <InvoicesTab />}
          {currentTab === 1 && <ProductsTab />}
          {currentTab === 2 && <CustomersTab />}
        </Box>
      </Container>
    </ErrorBoundary>
  );
}

export default App;
