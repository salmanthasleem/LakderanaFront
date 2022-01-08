import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const setQueryAsync = createAsyncThunk('glocation/setQuery', async (value = "") => {
    const val = await value
    return val
})


const gLocation = createSlice({
    name: 'glocation',
    initialState: {
        query: ""
    },
    extraReducers: builder => builder
        .addCase(setQueryAsync.fulfilled, (state, action) => {
            state.query = action.payload
        })
})



export default gLocation.reducer