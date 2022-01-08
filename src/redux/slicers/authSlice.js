import { createSlice } from "@reduxjs/toolkit";

const auth = createSlice({
    name: "auth",
    initialState: {
        isOwner: false
    },
    reducers: {
        setIsOwner: (state, actions) => {
            state.isOwner = actions.payload
        }
    }
})

export const setIsOwnerAsync = value => dispatch => {
    setTimeout(() => {
        dispatch(setIsOwner(value));
    }, 1000);
};


export const { setIsOwner } = auth.actions

export default auth.reducer