import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prescriptions: JSON.parse(localStorage.getItem('prescriptions')) || []
};

const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    addPrescription: (state, action) => {
      state.prescriptions.push(action.payload);
      localStorage.setItem('prescriptions', JSON.stringify(state.prescriptions));
    },
    updatePrescription: (state, action) => {
      const index = state.prescriptions.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.prescriptions[index] = action.payload;
        localStorage.setItem('prescriptions', JSON.stringify(state.prescriptions));
      }
    },
    deletePrescription: (state, action) => {
      state.prescriptions = state.prescriptions.filter(p => p.id !== action.payload);
      localStorage.setItem('prescriptions', JSON.stringify(state.prescriptions));
    }
  },
});

export const { addPrescription, updatePrescription, deletePrescription } = prescriptionSlice.actions;
export default prescriptionSlice.reducer;

