import React, { useState, useEffect } from "react";
import _TextField from "../../../components/auth/textField"
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, Modal, Box } from "@mui/material";
import api from "../../../api/api";
import { CSVDownload, CSVLink } from "react-csv";


// {
//     "id": 22,
//     "branchId": 56,
//     "roomId": 22,
//     "customerId": 11,
//     "checkIn": "2022-01-02T18:30:00.000Z",
//     "checkOut": "2022-01-05T18:30:00.000Z",
//     "pricePerNight": 20000,
//     "noOfAdults": 3,
//     "noOfChildren": 3,
//     "Total": 60000,
//     "lengthOfStay": 3,
//     "name": "asdasfadgda",
//     "mobileNo": "78482344848448",
//     "identityId": "a48asda4gasgsd",
//     "roomNo": 234,
//     "isBooked": 1,
//     "roomTypeId": 9
//   }
const columns = [
    { field: 'name', headerName: 'Name', align: "center", width: 200 },
    { field: 'mobileNo', headerName: 'Mobile Number', align: "center", width: 200 },
    { field: 'identityId', headerName: 'Identity(Passport/NIC)', align: "center", width: 150 },
    { field: 'roomNo', headerName: 'Room Number', type: 'number', align: "center", width: 100 },
    { field: 'id', headerName: 'ID', align: "center", width: 100 },
    { field: 'branchId', headerName: 'Branch ID', align: "center", width: 100 },
    { field: 'roomId', headerName: 'Room ID', align: "center", width: 100 },
    { field: 'customerId', headerName: 'Customer ID', align: "center", width: 150 },
    {
        field: 'checkIn',
        headerName: 'Check-In Date',
        width: 150,
        valueGetter: (params) => {
            const row = params.row
            return new Date(row.checkIn).toLocaleDateString()
        }
    },
    {
        field: 'checkOut',
        headerName: 'Check-Out Date',
        width: 150,
        valueGetter: (params) => {
            const row = params.row
            return new Date(row.checkOut).toLocaleDateString()
        }
    },
    {
        field: 'checkIn',
        headerName: 'Checked In Date',
        align: "center", width: 200,

    },
    {
        field: 'checkOut',
        headerName: 'Check Out Date',
        align: "center", width: 200,

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
        align: "center", width: 200,
    },
    { field: 'pricePerNight', headerName: 'Price Per Night', align: "center", width: 150 },
    { field: 'Total', headerName: 'Total Price', align: "center", width: 150 },
    {
        field: 'lengthOfStay',
        headerName: 'Length Of Stay(Days)',
        type: 'number',
        align: "center", width: 200,
    },
    {
        field: 'isBooked',
        headerName: 'Booked(bool)',
        align: "center", width: 0,
        hide: true
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        valueGetter: (params) => {
            const row = params.row
            return row.isBooked === 1 ? "In" : "Out"
        }
    },
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


const InHotelCustomers = () => {
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [branchId, setBranchId] = useState("")
    const [allCustomers, setAllCustomers] = useState([])
    const [helper, setHelper] = useState("")
    const [nameQuery, setNameQuery] = useState("")
    const [roomNoQuery, setRoomNoQuery] = useState("")


    useEffect(() => {
        const user = window.localStorage.getItem("@user")
        const data = JSON.parse(user)
        const branchId = data.branchId
        setBranchId(branchId)
    }, [])

    useEffect(() => {
        getCustomers()
    }, [branchId])


    const getCustomers = async (name = "", roomNo = "") => {
        if (branchId) {
            try {
                const response = await api.get("/manage/room/getBooked/", {
                    params: {
                        branchId: branchId,
                        name: name,
                        roomNo: roomNo
                    }
                })
                const data = await response.data
                const message = data.message
                const rows = data.data.data
                const isSuccess = data.data.isSuccess
                if (isSuccess) {
                    setAllCustomers(rows)
                    setHelper(message)
                    setTimeout(() => setHelper(""), 2000)
                } else {
                    setAllCustomers([])
                    setHelper(message)
                    setTimeout(() => setHelper(""), 2000)
                }
            } catch (error) {
                if (error.response) {
                    const data = error.response.data
                    const message = data.message
                    setAllCustomers([])
                    setHelper(message)
                } else {
                    setAllCustomers([])
                    setHelper("Something Went Wrong")
                }
                setTimeout(() => setHelper(""), 2000)
            }
        }
    }

    useEffect(() => {
        getCustomers(nameQuery, roomNoQuery)
    }, [nameQuery, roomNoQuery])



    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <_TextField
                    label="Search By Customer Name"
                    name="customer"
                    pHolder="Search For Customers By Name"
                    type="search"
                    onChange={(e) => setNameQuery(e.target.value)}
                    value={nameQuery}
                    error={false}
                    // helper={}
                    margin='dense'
                    sx={{
                        padding: 2
                    }}
                    variant="standard"
                    focused={true}
                />
                <_TextField
                    label="Search By Room No"
                    name="roomNo"
                    pHolder="Search For Customers By Name"
                    type="search"
                    onChange={(e) => setRoomNoQuery(e.target.value)}
                    error={false}
                    // helper={}
                    margin='dense'
                    sx={{
                        padding: 2
                    }}
                    variant="standard"
                    focused={true}
                    value={roomNoQuery}
                />
            </Box>
            <div style={{ display: 'flex' }}>
                <div style={{ height: '70vh', width: '100%' }}>
                    <DataGrid
                        rows={allCustomers}
                        columns={columns}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true}
                        autoPageSize
                    />
                </div>

            </div>

            <div style={{ width: '100%', display: "flex", justifyContent: 'flex-start', alignItems: 'center', height: '4rem', marginLeft: '1rem' }}>
                <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} disabled={selected.length > 0 ? false : true} onClick={handleOpen}>Check Out Customer</Button>
                {allCustomers &&
                    <Button
                        variant="contained" color="primary" type='button' size="large" sx={{ marginRight: 1 }} disabled={allCustomers.length > 0 ? false : true}><CSVLink data={allCustomers} style={{ textDecoration: 'none', color: 'white' }} >Download Table</CSVLink></Button>}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are You Sure ?
                    </Typography>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }} >
                        <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} >Yes</Button>
                        <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} >No</Button>
                    </div>
                </Box>
            </Modal>
        </>
    )
}

export default InHotelCustomers