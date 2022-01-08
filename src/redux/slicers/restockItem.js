import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setParamsAsync = createAsyncThunk('barItem/setParams', async (value = { stock: "", branchId: "", itemId: "", name: "", type: "", quantity: "" }) => {
    const val = await value
    return val
})



const restockBarItem = createSlice({
    name: "restockBarItem",
    initialState: {
        itemParams: {
            stock: "",
            branchId: "",
            itemId: "",
            name: "",
            type: "",
            quantity: ""
        },
        restockModalOpen: false
    },
    reducers: {
        setRestockModalOpen: (state, actions) => {
            state.restockModalOpen = actions.payload
        }
    },
    extraReducers: builder => builder
        .addCase(setParamsAsync.fulfilled, (state, action) => {
            state.itemParams = action.payload
        })
})

export const { setRestockModalOpen } = restockBarItem.actions

export default restockBarItem.reducer