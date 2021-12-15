import React, { useState } from "react";
import _TextField from "../../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Box, TextField, Autocomplete } from "@mui/material";


const columns = [

    { field: 'id', headerName: 'ID', align: "center", width: 70 },
    { field: 'name', headerName: 'Name', align: "center", width: 130 },
    { field: 'roomNo', headerName: 'Room Number', type: 'number', align: "center", width: 130 },
    {
        field: 'checkedIn',
        headerName: 'Checked In Date',
        type: 'date',
        align: "center", width: 150,
    },
    {
        field: 'lengthOfStay',
        headerName: 'Length Of Stay(Nights)',
        type: 'number',
        align: "center", width: 90,
    },
    {
        field: 'noOfAdults',
        headerName: 'Number Of Adults',
        type: 'date',
        align: "center", width: 150,
    },
    {
        field: 'noOfChildren',
        headerName: 'Number Of Children',
        type: 'number',
        align: "center", width: 170,
    },
    {
        field: 'status',
        headerName: 'Status',
        align: "center", width: 120,
    },
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

const rows = [
    { id: 1, name: 'Snow', roomNo: 'Jon', checkedIn: 35, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 2, name: 'Lannister', roomNo: 'Cersei', checkedIn: 42, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 3, name: 'Lannister', roomNo: 'Jaime', checkedIn: 45, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 4, name: 'Stark', roomNo: 'Arya', checkedIn: 16, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 5, name: 'Targaryen', roomNo: 'Daenerys', checkedIn: 5, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 6, name: 'Melisandre', roomNo: null, checkedIn: 150, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 7, name: 'Clifford', roomNo: 'Ferrara', checkedIn: 44, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 8, name: 'Frances', roomNo: 'Rossini', checkedIn: 36, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
    { id: 9, name: 'Roxie', roomNo: 'Harvey', checkedIn: 65, lengthOfStay: 5, noOfAdults: 4, noOfChildren: 2, status: "In-Hotel" },
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

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: '2rem' }}>
                <Autocomplete
                    disablePortal
                    options={["Branch 1", "Branch 2"]}
                    renderInput={(params) => <TextField {...params} label="Location" variant="standard" />}

                    sx={{ width: 1 / 5 }}

                />
            </Box>

            <div style={{ display: 'flex' }}>
                <div style={{ height: '80vh', minWidth: '60%', margin: 'auto' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true}

                    />
                </div>

            </div>
        </>
    )
}

export default ViewBranches