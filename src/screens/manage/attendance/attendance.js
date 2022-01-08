import React, { useState, useEffect } from "react";
import { DataGrid, } from '@mui/x-data-grid';
import { Button, Box, Typography } from "@mui/material";
import _TextField from "../../../components/auth/textField";
import QrReader from 'react-qr-scanner'
import api from '../../../api/api'


const columns = [

    { field: 'id', headerName: 'ID', align: "center", width: 100 },
    { field: 'branchId', headerName: 'Branch ID', align: "center", width: 100 },
    { field: 'firstName', headerName: 'First Name', align: "center", width: 200 },
    { field: 'lastName', headerName: 'Last Name', type: 'number', align: "center", width: 200 },
    {
        field: 'fullName',
        headerName: 'Full name',
        sortable: false,
        width: 300,
        valueGetter: (params) =>
            `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''
            }`
        ,


    },
    {
        field: 'email',
        headerName: 'Email',
        align: "center", width: 300
    },
    {
        field: 'userName',
        headerName: 'User Name',
        align: "center", width: 200
    },
    {
        field: 'status',
        headerName: 'Status',
        align: "center", width: 200
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


const Attendance = () => {
    const [selected, setSelected] = useState([])
    const [delay, setDelay] = useState(100)
    const [openQr, setQrDiv] = useState(false)
    const [attendance, setAttendance] = useState([])
    const [allEmployees, setAllEmployees] = useState([])
    const [startMark, setStartMark] = useState(false)
    const [helper, setHelper] = useState("")
    const [marked, setMarked] = useState("")
    const [branchId, setBranchId] = useState("")
    const [confirm, setConfirm] = useState(false)

    const handleMark = async () => {
        if (confirm) {
            const ids = attendance.map(emp => emp.id)
            if (ids) {
                try {
                    const body = {
                        attendance: ids,
                        branchId: branchId
                    }
                    const response = await api.post("/hr/attendance/mark/", body)
                    const isSuccess = response.data.data.isSuccess
                    if (isSuccess) {
                        setStartMark(false)
                        setConfirm(false)
                        setAttendance([])
                        setHelper("")
                        checkAttendance()
                    }
                    // console.log(response.data.data)
                } catch (error) {
                    //console.log(error.response.data.data)
                    const isNotSuccess = error.response.data.data.isSuccess
                    if (!isNotSuccess) {
                        checkAttendance()
                    }
                }
                setConfirm(false)
            }
        } else {
            setConfirm(true)
        }
    }

    const handleOpen = () => {
        setStartMark(true)
    }
    const handleScan = id => {
        if (id) {
            if (id.text) {
                const findOne = allEmployees.find(employee => id.text == employee.id)
                if (!attendance.includes(findOne)) {
                    console.log(findOne)
                    setAttendance(prev => [...prev, findOne])
                }
            }
        }
    }
    const handleError = err => {
        alert(err)
    }

    const getEmployees = async () => {
        try {
            const response = await api.get("/manage/employee/searchEmployee/", {
                params: {
                    branchId: branchId
                }
            })
            const data = await response.data.data
            const isAvailable = data.isAvailable
            if (isAvailable) {
                setAllEmployees(data.rows)
            } else {
                setAllEmployees([])
            }
        } catch (error) {
            const data = error.response.data.data
            const isAvailable = data.isAvailable
            if (isAvailable === false) {
                setAllEmployees([])
            }
        }
    }

    const checkAttendance = async () => {
        try {
            const date = new Date().toISOString().split("T")[0]
            const response = await api.get("/hr/attendance/get/", {
                params: {
                    branchId: branchId,
                    date: date
                }
            })
            const data = await response.data
            const isSuccess = await data.data.isSuccess
            const message = await data.message
            if (typeof isSuccess === "boolean") {
                setMarked(isSuccess)
            }
            setHelper(message)
        } catch (error) {
            const errData = error.response.data
            const isSuccess = errData.data.isSuccess
            const msg = errData.message
            setHelper(msg)
            if (typeof isSuccess === "boolean") {
                setMarked(isSuccess)
            }
        }
    }

    useEffect(async () => {
        const user = await window.localStorage.getItem("@user")
        const branchId = await JSON.parse(user).branchId
        setBranchId(branchId)

    }, [])

    useEffect(() => {
        if (branchId) {
            getEmployees()
            checkAttendance()
        }
    }, [branchId])

    console.log(allEmployees)
    return (
        <>
            <div style={{ display: 'flex', backgroundColor: !startMark ? '#081627' : null }}>
                <div style={{ height: '80vh', width: !startMark ? '100%' : '70%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {!startMark && <Button variant="contained" color="secondary" type='submit' size="large" sx={{ margin: '2rem', height: '10rem', width: '90%', justifySelf: 'center', fontSize: 50 }} onClick={handleOpen}>
                        Mark Attendance For Today
                    </Button>}
                    {startMark && !marked && <DataGrid
                        rows={attendance}
                        columns={columns}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true}
                        sx={{ width: 1 }}
                        autoPageSize

                    />}
                    {
                        startMark && marked && <Typography component="h4" variant="h5" >{helper}</Typography>
                    }

                </div>
                {openQr && <Box sx={{ display: 'flex', flexDirection: 'column', width: '50rem', height: '40rem', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <Box sx={{ width: '45rem', height: '35rem', marginBottom: '2rem' }}>
                        {openQr && <QrReader
                            delay={delay}
                            style={{
                                height: "35rem",
                                width: "45rem"
                            }}
                            onError={handleError}
                            onScan={handleScan}
                            facingMode="user"
                        />}
                    </Box>
                    {
                        startMark && !marked && <Typography component="h4" variant="h5" >{helper}</Typography>
                    }
                </Box>}
            </div>

            <div style={{ width: '100%', display: "flex", justifyContent: 'flex-start', alignItems: 'center', height: '4rem', marginLeft: '1rem' }}>
                {!marked && startMark && <Button variant="contained" color={confirm ? "warning" : "primary"} type='button' size="large" sx={{ marginRight: 1 }} onClick={() => handleMark()}>{confirm ? "Confirm Complete Attendance" : "Complete Attendance"}</Button>}
                {confirm && <Button variant="contained" color="error" type='button' size="large" sx={{ marginRight: 1 }} onClick={() => setConfirm(false)}>Cancel</Button>}
                {startMark && !marked && <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} onClick={() => setQrDiv(!openQr)}>{openQr ? "Close Scanner" : "Open Scanner"}</Button>}
            </div>
        </>
    )
}

export default Attendance