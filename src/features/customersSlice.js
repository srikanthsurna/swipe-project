import { createSlice } from "@reduxjs/toolkit";

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      state.items.push(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
        // Trigger invoice update
        state.items[index].lastUpdated = new Date().toISOString();
      }
    },
    setCustomers: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addCustomer, updateCustomer, setCustomers } =
  customersSlice.actions;
export default customersSlice.reducer;
