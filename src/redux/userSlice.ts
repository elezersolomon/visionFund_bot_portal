// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearScreenDown } from "readline";

interface UserState {
  userID: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  branchID: number;
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
  branchID: 0,
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
    // update the token on (state.user.token part)
    updateToken: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        token: action.payload
      };
    },
  },
});

export const { setUser, clearUser, updateToken } = userSlice.actions;
export default userSlice.reducer;
