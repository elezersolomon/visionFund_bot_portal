import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage for web
import { combineReducers } from "redux";
import userReducer from "./userSlice";

// Redux Persist Config
const persistConfig = {
  key: "root", // Root key in storage (you can change it if necessary)
  storage, // Defaults to localStorage for web
};

// Combine reducers (in case you add more slices later)
const rootReducer = combineReducers({
  user: userReducer,
});

// Apply persistReducer to the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store using the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Create the persistor (which will be used to persist the store)
export const persistor = persistStore(store);

// Export types for the store's state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
