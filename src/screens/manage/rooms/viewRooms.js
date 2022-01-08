import React, { useState, useEffect } from "react";
import _TextField from "../../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Box, TextField, Autocomplete, Button } from "@mui/material";
import api from '../../../api/api'
import BranchField from '../../../components/branchField'
import { useSelector } from "react-redux";
import { CSVLink } from "react-csv";

const columns = [
    { field: 'id', headerName: 'ID', align: "center", width: 70 },
    { field: 'roomNo', headerName: 'Room Number', type: 'number', align: "center", width: 200 },
    { field: 'isBooked', headerName: 'Booked', align: "center", width: 200 },
    {
        field: 'type',
        headerName: 'Room Type',
        align: "center", width: 200,
    },
    {
        field: 'pricePerNight',
        headerName: 'Price Per Night',
        type: 'number',
        align: "center", width: 200,
    },
    {
        field: 'minAdults',
        headerName: 'Minimum Number Of Adults',
        type: 'date',
        align: "center", width: 300,
    },
    {
        field: 'minChildren',
        headerName: 'Minimum Number Of Children',
        type: 'number',
        align: "center", width: 300,
    },
    {
        field: 'branchId',
        headerName: 'Branch ID',
        align: "center", width: 200,
    },
    {
        field: 'location',
        headerName: 'Location',
        align: "center", width: 200,
    },
    {
        field: 'roomStatus',
        headerName: 'Room Status',
        sortable: false,
        width: 200,
        valueGetter: ({ row }) => {
            const value = row.isBooked
            return value == 0 ? "Open" : "Booked"
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


const ViewRooms = () => {
    const [selected, setSelected] = useState([])
    const [rooms, setRooms] = useState([])
    const [initialRooms, setInitialRooms] = useState([])
    const [isRoom, setIsRoom] = useState(false)
    const [roomQuery, setRoomQuery] = useState("")
    const [empId, setEmpId] = useState(null)
    const branch = useSelector(state => state.branch.branchId)

    const getRooms = async () => {
        const user = await window.localStorage.getItem("@user")
        const data = await JSON.parse(user)
        const branchId = data.branchId
        const employeeId = data.employeeId
        setEmpId(employeeId)
        try {
            const response = await api.get('/manage/room/getAll/', {
                params: {
                    employeeId: employeeId,
                    branchId: branchId || null
                }
            })
            const data = await response.data.data
            const isRoom = await data.isRoom
            if (isRoom) {
                const rows = await data.rows
                setRooms(rows)
                setInitialRooms(rows)
            }
            setIsRoom(isRoom)
        } catch (error) {
            const err = await error.response.data.data
            const isRoom = err.isRoom
            if (!isRoom) {
                setIsRoom(isRoom)
            }
        }
    }

    const searchQuery = async (branch, employeeId, roomNo = null) => {

        try {
            const req = await api.get("/manage/room/getFilter/", {
                params: {
                    employeeId: employeeId,
                    branchId: branch,
                    roomNo: roomNo
                }
            })
            const data = await req.data.data
            const isRoom = data.isRoom
            const rows = data.rows
            if (isRoom) {
                setRooms(rows)
            } else {
                setRooms([])
            }
            setIsRoom(isRoom)
        } catch (error) {
            const isRoom = error.response.data.data.isRoom
            setIsRoom(isRoom)
            if (!isRoom) {
                setRooms([])
            }
        }


    }

    useEffect(() => {
        if (branch && empId) {
            searchQuery(branch, empId, roomQuery)
        }
    }, [roomQuery, branch])

    useEffect(() => {
        getRooms()
    }, [])

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '1rem 2rem', width: 1 }}>
                {/* <Autocomplete
                    disablePortal
                    options={["Branch 1", "Branch 2"]}
                    renderInput={(params) => <TextField {...params} label="Branch" variant="standard" />}

                    sx={{ width: 1 / 5 }}

                /> */}
                <BranchField showBranchName={false}
                    sx={{ width: '20rem', margin: '1rem 2rem' }}
                />
                <_TextField
                    label="Search By Room Number"
                    pHolder="0"
                    type='number'
                    value={roomQuery}
                    onChange={(e) => setRoomQuery(e.target.value)}
                    name="roomNo"
                    sx={{ width: '20rem', margin: '1rem 2rem' }}
                    disabled={branch ? false : true}
                    margin="none"
                />
            </Box>

            <div style={{ display: 'flex' }}>
                <div style={{ height: '80vh', width: '100%' }}>
                    <DataGrid
                        rows={rooms}
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
                {rooms &&
                    <Button
                        variant="contained" color="primary" type='button' size="large" sx={{ marginRight: 1 }} disabled={rooms.length > 0 ? false : true} ><CSVLink data={rooms} style={{ textDecoration: 'none', color: 'white' }} >Download Table</CSVLink></Button>}
            </div>
        </>
    )
}

export default ViewRooms