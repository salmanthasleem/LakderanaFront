import React, { useState, useEffect } from "react";
import _TextField from "../../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Box, TextField, Autocomplete } from "@mui/material";
import api from "../../../api/api";


const columns = [

    { field: 'id', headerName: 'ID', align: "center", width: 250, headerAlign: "center" },
    { field: 'branchName', headerName: 'Branch Name', align: "center", width: 400, headerAlign: "center" },
    { field: 'location', headerName: 'Branch Location', type: 'number', align: "center", width: 400, headerAlign: "center" },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params) =>
    //         `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''
    //         }`,
    // },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 200
};


const ViewBranches = () => {
    const [selected, setSelected] = useState([])
    const [branches, setBranches] = useState([])
    const [helper, setHelper] = useState("")
    const [branchName, setBranchName] = useState("")
    const [location, setLocation] = useState("")

    const getBranches = async (name = "", location = "") => {
        try {
            const response = await api.get("/branch/getAll/", {
                params: {
                    branchName: name,
                    location: location
                }
            })
            const data = await response.data
            const rows = data.data
            setBranches(rows)
            setHelper(data.message)
            setTimeout(() => setHelper(""), 2000)
        } catch (error) {
            const data = error.response.data
            setBranches([])
            setHelper(data.message)
            setTimeout(() => setHelper(""), 2000)
        }
    }
    useEffect(() => {
        getBranches(branchName, location)
    }, [branchName, location])


    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '2rem' }}>
                <_TextField
                    label="Search By Branch Name"
                    pHolder="0"
                    type='text'
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    name="branchName"
                    margin="none"
                    sx={{ margin: '1rem' }}
                />
                <_TextField
                    label="Search By Branch Location"
                    pHolder="0"
                    type='text'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    name="location"
                    margin="none"
                    sx={{ margin: '1rem' }}
                />
            </Box>

            <div style={{ display: 'flex' }}>
                <div style={{ height: '80vh', minWidth: '50%', margin: 'auto' }}>
                    <DataGrid
                        rows={branches}
                        columns={columns}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true}
                        autoPageSize
                        sx={{ fontSize: 20 }}
                    />
                </div>

            </div>
        </>
    )
}

export default ViewBranches