import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setEmpValuesAsync = createAsyncThunk('searchEmployee/setEmpValues', async (value = { empFName: "", empLName: "", email: "", status: "", dob: "", branchId: "" }) => {
    const val = await value
    return val
})

export const setbranchIdAsync = createAsyncThunk('searchEmployee/setbranchId', async (value) => {
    const val = await value
    return val
})

const searchEmployee = createSlice({
    name: "searchEmployee",
    initialState: {
        empValues: {
            empFName: "",
            empLName: "",
            email: "",
            status: "",
            branchId: ""
        },
        branchId: ""
    },
    extraReducers: builder => builder
        .addCase(setEmpValuesAsync.fulfilled, (state, action) => {
            state.empValues = action.payload
        })
        .addCase(setbranchIdAsync.fulfilled, (state, action) => {
            state.branchId = action.payload || ""
        })
})


export default searchEmployee.reducer