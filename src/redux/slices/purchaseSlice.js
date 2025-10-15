import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: JSON.parse(localStorage.getItem('purchaseInvoices')) || [],
  returns: JSON.parse(localStorage.getItem('purchaseReturns')) || []
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    addPurchaseInvoice: (state, action) => {
      state.invoices.push(action.payload);
      localStorage.setItem('purchaseInvoices', JSON.stringify(state.invoices));
    },
    addPurchaseReturn: (state, action) => {
      state.returns.push(action.payload);
      localStorage.setItem('purchaseReturns', JSON.stringify(state.returns));
    }
  },
});

export const { addPurchaseInvoice, addPurchaseReturn } = purchaseSlice.actions;
export default purchaseSlice.reducer;

