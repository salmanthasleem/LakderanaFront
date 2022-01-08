import { createSlice } from "@reduxjs/toolkit";

const inquiry = createSlice({
    name: "inquiry",
    initialState: {
        modalOpen: false,
        reload: true,
        statusModal: false
    },
    reducers: {
        setModalOpen: (state, actions) => {
            state.modalOpen = actions.payload
        },
        setReload: (state, actions) => {
            state.reload = actions.payload
        },
        setStatusModal: (state, action) => {
            state.statusModal = action.payload
        }
    }
})



export const { setModalOpen, setReload, setStatusModal } = inquiry.actions

export default inquiry.reducer