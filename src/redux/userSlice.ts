// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      console.log("consoleData_state", state);
      return action.payload;
    },
    clearUser: () => initialState,
    updateToken: (state, action: PayloadAction<string>) => {
      console.log("consoleData_ update token", state, action.payload);
      state.token = action.payload; // Update only the token
    },
  },
});

export const { setUser, clearUser, updateToken } = userSlice.actions;
export default userSlice.reducer;
