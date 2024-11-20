import { configureStore } from "@reduxjs/toolkit";
import invoicesReducer from "../features/invoicesSlice";
import productsReducer from "../features/productsSlice";
import customersReducer from "../features/customersSlice";

export const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    products: productsReducer,
    customers: customersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
