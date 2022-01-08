import React, { useState, useEffect } from "react";
import { Button, Autocomplete, TextField, Box, Divider, Checkbox, FormControlLabel, Radio, RadioGroup, FormLabel, Typography } from "@mui/material";
import _TextField from "./auth/textField";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { setBranch, setBranchName } from "../redux/slicers/branchSlice";





const BranchField = ({ errors, helpers, onChange, showBranchName, sx, container }) => {
    const dispatch = useDispatch()
    const [isOwner, setOwner] = useState(false)
    const [branches, setBranches] = useState([])
    const [isBranch, setisBranch] = useState(false)
    const [selectBranch, setSelectBranch] = useState({ id: "", branchName: "" })
    const branchId = useSelector(state => state.branch.branchId)
    const showName = typeof showBranchName === 'boolean' ? showBranchName : true

    useEffect(async () => {
        const user = await window.localStorage.getItem("@user")
        const data = await JSON.parse(user)
        const empStatus = await data.empStatus
        const branchId = await data.branchId

        if (empStatus === 'Owner') {
            setOwner(true)
            const branchResponse = await api.get("/branch/getAll")
            const data = await branchResponse.data.data
            const branches = await data.map(branch => ({ id: branch.id.toString(), name: branch.branchName.toString() }))
            setBranches(branches)
            dispatch(setBranch(""))
        } else {
            dispatch(setBranch(branchId))
        }
    }, [])


    return (
        <Box sx={container}>
            {
                isOwner &&
                <Autocomplete
                    disablePortal
                    options={branches.map(branch => branch.id.toString())}
                    renderInput={(params) => <TextField {...params} label="Branch" />}
                    name="branch"
                    onChange={(e, val) => {
                        if (val) {
                            const int = Number(val)
                            dispatch(setBranch(int))

                            const branchName = branches.filter(branch => branch.id === val)[0].name
                            setSelectBranch({ id: val, branchName: branchName })
                            dispatch(setBranchName(branchName))
                            setisBranch(true)
                        }
                    }}
                    value={selectBranch.id}
                    sx={sx}
                    onInputChange={(e, val) => {
                        dispatch(setBranch(val))
                        dispatch(setBranchName(""))
                        setSelectBranch({ id: "", branchName: "" })
                    }

                    }
                />
            }
            {
                showName &&
                <_TextField
                    label="Branch Name"
                    shrink={true}
                    required
                    type='text'
                    shrink={true}
                    disabled={true}
                    default={selectBranch.branchName}
                    value={selectBranch.branchName}
                    sx={sx}
                />
            }
            {errors && <Typography sx={{ color: 'red' }}>{helpers}</Typography>}
            {
                !isOwner &&
                <_TextField
                    label="Branch Id"
                    shrink={true}
                    required
                    type='number'
                    value={branchId}
                    shrink={true}
                    name="branch"
                    disabled={true}
                    error={errors}
                    helperText={helpers}
                    onChange={onChange}
                    value={branchId}
                    sx={sx}
                />
            }
        </Box>
    )
}

export default BranchField