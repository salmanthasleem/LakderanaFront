import { createSlice } from "@reduxjs/toolkit";


const branch = createSlice({
    name: 'branch',
    initialState: {
        branchId: '',
        branchName: ""
    },
    reducers: {
        setBranch: (state, actions) => {
            state.branchId = actions.payload
        },
        setBranchName: (state, actions) => {
            state.branchName = actions.payload
        }
    }
})

export const { setBranch, setBranchName } = branch.actions

export default branch.reducer