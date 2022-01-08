import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setNameAsync = createAsyncThunk('barItem/setName', async (value = "") => {
    const val = await value
    return val
})

export const setTypeAsync = createAsyncThunk('barItem/setType', async (value = "") => {
    const val = await value
    return val
})

export const setQuantityAsync = createAsyncThunk('barItem/setQuantity', async (value = "") => {
    const val = await value
    return val
})

export const setPriceAsync = createAsyncThunk('barItem/setPrice', async (value = "") => {
    const val = await value
    return val
})

export const setCostAsync = createAsyncThunk('beverage/setCost', async (value = "") => {
    const val = await value
    return val
})


const barItem = createSlice({
    name: "barItem",
    initialState: {
        name: "",
        type: "",
        quantity: "",
        price: "",
        cost: "",
        modalOpen: false
    },
    reducers: {
        setModalOpen: (state, actions) => {
            state.modalOpen = actions.payload
        }
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
})

export const { setModalOpen } = barItem.actions

export default barItem.reducer