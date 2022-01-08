import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setNameAsync = createAsyncThunk('beverage/setName', async (value = "") => {
    const val = await value
    return val
})

export const setTypeAsync = createAsyncThunk('beverage/setType', async (value = "") => {
    const val = await value
    return val
})

export const setQuantityAsync = createAsyncThunk('beverage/setQuantity', async (value = "") => {
    const val = await value
    return val
})

export const setPriceAsync = createAsyncThunk('beverage/setPrice', async (value = "") => {
    const val = await value
    return val
})

export const setCostAsync = createAsyncThunk('beverage/setCost', async (value = "") => {
    const val = await value
    return val
})

export const setStockAsync = createAsyncThunk('beverage/setStock', async (value = "") => {
    const val = await value
    return val
})

export const clearFieldsAsync = createAsyncThunk('beverage/clearFields', async (value = { name: "", type: "", quantity: "", price: "", cost: "", stock: "" }) => {
    const val = await value
    return val
})

const beverage = createSlice({
    name: "beverage",
    initialState: {
        name: "",
        type: "",
        quantity: "",
        price: "",
        cost: "",
        stock: ""
    },
    extraReducers: builder => builder
        .addCase(setNameAsync.fulfilled, (state, action) => {
            state.name = action.payload
        })
        .addCase(setTypeAsync.fulfilled, (state, action) => {
            state.type = action.payload
        })
        .addCase(setQuantityAsync.fulfilled, (state, action) => {
            state.quantity = action.payload
        })
        .addCase(setPriceAsync.fulfilled, (state, action) => {
            state.price = action.payload
        })
        .addCase(setCostAsync.fulfilled, (state, action) => {
            state.cost = action.payload
        })
        .addCase(setStockAsync.fulfilled, (state, action) => {
            state.stock = action.payload
        })
        .addCase(clearFieldsAsync.fulfilled, (state, action) => {
            state = action.payload
        })
})


export default beverage.reducer