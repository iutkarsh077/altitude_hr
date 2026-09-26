"use client";
import { configureStore } from "@reduxjs/toolkit";
import UserInfo from "@/features/userslices";

const store = configureStore({
    reducer: {
        UserInfo
    }
})


export default store