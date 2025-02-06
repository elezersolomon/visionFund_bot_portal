import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // Import the user slice reducer

export const store = configureStore({
  reducer: {
    user: userReducer, // Register the user reducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
