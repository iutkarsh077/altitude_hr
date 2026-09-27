"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialUserDetails = {
    user: null
}

const UserSlice = createSlice({
    name: "userinfo",
    initialState: initialUserDetails,
    reducers: {
        AddUserInformation: (state, action) => {
            // console.log("action is: ", action.payload)
            state.user = action.payload
        },
        ClearUserInformation: (state) => {
            state.user = null;
        },
    }
})

export const { AddUserInformation, ClearUserInformation } = UserSlice.actions
export default UserSlice.reducer;