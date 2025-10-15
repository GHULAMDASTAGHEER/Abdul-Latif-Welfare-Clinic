import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: JSON.parse(localStorage.getItem('salesInvoices')) || [],
  returns: JSON.parse(localStorage.getItem('salesReturns')) || []
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    addSaleInvoice: (state, action) => {
      state.invoices.push(action.payload);
      localStorage.setItem('salesInvoices', JSON.stringify(state.invoices));
    },
    addSaleReturn: (state, action) => {
      state.returns.push(action.payload);
      localStorage.setItem('salesReturns', JSON.stringify(state.returns));
    }
  },
});

export const { addSaleInvoice, addSaleReturn } = salesSlice.actions;
export default salesSlice.reducer;

