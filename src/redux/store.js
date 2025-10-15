import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";
import patientReducer from "./slices/patientSlice";
import authReducer from "./slices/authSlice";
import inventoryReducer from "./slices/inventorySlice";
import salesReducer from "./slices/salesSlice";
import purchaseReducer from "./slices/purchaseSlice";
import prescriptionReducer from "./slices/prescriptionSlice";

const persistConfig = {
  key: "root",
  storage: localForage,
  throttle: 1000,
  timeout: 0,
};

const rootReducer = combineReducers({
  patients: patientReducer,
  auth: authReducer,
  inventory: inventoryReducer,
  sales: salesReducer,
  purchase: purchaseReducer,
  prescription: prescriptionReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
