import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import localForage from "localforage";
import patientReducer from "./slices/patientSlice";

const persistConfig = {
  key: "root",
  storage: localForage, // IndexedDB via localForage for large offline storage
  throttle: 1000,
  timeout: 0,
};

const rootReducer = combineReducers({
  patients: patientReducer,
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
