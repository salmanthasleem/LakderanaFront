import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setcValuesAsync = createAsyncThunk('cusAutoFill/setcValues', async (value = { cName: "", cId: "", mobileNo: "", identityId: "", branchId: "" }) => {
    const val = await value
    return val
})

export const setbranchIdAsync = createAsyncThunk('cusAutoFill/setbranchId', async (value) => {
    const val = await value
    return val
})

const cusAutoFill = createSlice({
    name: "cusAutoFill",
    initialState: {
        cValues: {
            cName: "",
            cId: "",
            mobileNo: "",
            identityId: "",
            branchId: ""
        },
        branchId: ""
    },
    extraReducers: builder => builder
        .addCase(setcValuesAsync.fulfilled, (state, action) => {
            state.cValues = action.payload
        })
        .addCase(setbranchIdAsync.fulfilled, (state, action) => {
            state.branchId = action.payload || ""
        })
})


export default cusAutoFill.reducer