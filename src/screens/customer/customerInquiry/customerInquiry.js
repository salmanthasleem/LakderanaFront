import React, { useState } from "react";
import _TextField from "../../../components/auth/textField"
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography } from "@mui/material";


const columns = [

    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 90,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''
            }`,
    },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];





const CustomerInquiry = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState([])


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    return (
        <>
            <_TextField
                label="Search Customer"
                name="customer"
                pHolder="Search For Customers By Name"
                type="search"
                // onChange={props.onChange}
                error={false}
                // helper={}
                margin='dense'
                sx={{
                    padding: 2
                }}
                variant="standard"
                focused={true}
            />
            <div style={{ display: 'flex' }}>
                <div style={{ height: 400, width: '70%' }}>
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
                <div style={{ width: '30%', margin: '10px' }}>
                    <Typography variant="h6" gutterBottom component="div" paragraph align='center'>
                        Description
                    </Typography>
                </div>

            </div>

            <div style={{ width: '100%', display: "flex", justifyContent: 'flex-start', alignItems: 'center', height: '4rem', marginLeft: '1rem' }}>
                <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} >Add Inquiry</Button>
                <Button variant="contained" color="warning" type='submit' size="large" sx={{ marginRight: 1 }}>Change Status</Button>
            </div>


        </>
    )
}

export default CustomerInquiry