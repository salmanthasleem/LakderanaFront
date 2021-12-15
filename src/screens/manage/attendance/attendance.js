import React, { useState } from "react";
import { DataGrid, } from '@mui/x-data-grid';
import { Button, Box } from "@mui/material";
import _TextField from "../../../components/auth/textField";
import QrReader from 'react-qr-scanner'


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


const Attendance = () => {
    const [selected, setSelected] = useState([])
    const [delay, setDelay] = useState(100)
    const [openQr, setQrDiv] = useState(false)
    const [attendance, setAttendance] = useState([])
    const [startMark, setStartMark] = useState(false)

    const handleMark = () => setStartMark(!startMark)

    const handleScan = data => {
        if (data) {
            const text = data.text.split(",")
            const object = {
                id: text[0],
                name: text[1],
                roomNo: text[2],
                checkedIn: text[3],
                lengthOfStay: text[4],
                noOfAdults: text[5],
                noOfChildren: text[6],
                status: text[7]
            }
            let id = [];
            attendance.forEach(element => {
                id.push(element.id)
            });
            if (!id.includes(object.id)) {
                setAttendance(prev => [...prev, object])
            }
        }
    }
    const handleError = err => {
        alert(err)
    }

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
            </Box>
            <div style={{ display: 'flex' }}>
                <div style={{ height: '80vh', width: '70%' }}>
                    {!startMark && <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} onClick={handleMark}>
                        Mark Attendance For Today
                    </Button>}
                    {startMark && <DataGrid
                        rows={attendance}
                        columns={columns}
                        pageSize={50}
                        rowsPerPageOptions={[50]}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true}

                    />}

                </div>
                {openQr && <QrReader
                    delay={delay}
                    style={{
                        height: "240",
                        width: "320"
                    }}
                    onError={handleError}
                    onScan={handleScan}
                    facingMode="user"
                />}
            </div>

            <div style={{ width: '100%', display: "flex", justifyContent: 'flex-start', alignItems: 'center', height: '4rem', marginLeft: '1rem' }}>
                <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} onClick={handleMark}>Complete Attendance</Button>
                <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} onClick={() => setQrDiv(!openQr)}>{openQr ? "Close Scanner" : "Open Scanner"}</Button>
            </div>
        </>
    )
}

export default Attendance