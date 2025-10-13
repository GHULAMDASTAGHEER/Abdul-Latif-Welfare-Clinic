import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    createPatient: (state, action) => {
      state.push(action.payload);
    },
    clearAllPatients: () => {
      return [];
    },
    deletePatient: (state, action) => {
      return state.filter((patient) => patient.serialNo !== action.payload);
    },
  },
});

export const { createPatient, clearAllPatients, deletePatient } = patientSlice.actions;
export default patientSlice.reducer;
