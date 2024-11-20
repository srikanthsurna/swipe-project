import { createSlice } from "@reduxjs/toolkit";

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addInvoice: (state, action) => {
      console.log("Adding invoice:", action.payload);
      state.items.push(action.payload);
    },
    updateInvoice: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setInvoices: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addInvoice, updateInvoice, setInvoices } = invoicesSlice.actions;
export default invoicesSlice.reducer;
