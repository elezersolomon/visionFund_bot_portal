// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearScreenDown } from "readline";

interface UserState {
  userID: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phoneNumber: string;
  status: string;
  token: string; // Add the token here
}

const initialState: UserState = {
  userID: 0,
  username: "",
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  phoneNumber: "",
  status: "",
  token: "", // Initialize the token as an empty string
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearUser: () => initialState,
    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload; // Ensures a new state is returned
    },
  },
});

export const { setUser, clearUser, updateToken } = userSlice.actions;
export default userSlice.reducer;
