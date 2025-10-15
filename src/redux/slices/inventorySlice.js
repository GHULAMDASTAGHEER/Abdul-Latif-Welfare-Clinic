import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem('inventory')) || [],
  brands: JSON.parse(localStorage.getItem('brands')) || []
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem('inventory', JSON.stringify(state.items));
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        localStorage.setItem('inventory', JSON.stringify(state.items));
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      localStorage.setItem('inventory', JSON.stringify(state.items));
    },
    updateStock: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.stock = (item.stock || 0) + quantity;
        localStorage.setItem('inventory', JSON.stringify(state.items));
      }
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
      localStorage.setItem('brands', JSON.stringify(state.brands));
    },
    deleteBrand: (state, action) => {
      state.brands = state.brands.filter(b => b.id !== action.payload);
      localStorage.setItem('brands', JSON.stringify(state.brands));
    }
  },
});

export const { addItem, updateItem, deleteItem, updateStock, addBrand, deleteBrand } = inventorySlice.actions;
export default inventorySlice.reducer;

