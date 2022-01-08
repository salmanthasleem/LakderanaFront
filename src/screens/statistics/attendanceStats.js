import React, { useState, useEffect } from "react";
import _TextField from "../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Box, FormControlLabel, Switch } from "@mui/material";
import BranchField from "../../components/branchField";
import { useSelector } from "react-redux";
import api from "../../api/api";

const columns = [
    {
        headerAlign: "center",
        field: 'id', headerName: 'ID', align: "center", width: 200
    },
    {
        headerAlign: "center",
        field: 'firstName', headerName: 'First Name', align: "center", width: 350
    },
    {
        headerAlign: "center",
        field: 'lastName', headerName: 'Last Name', align: "center", width: 350
    },
    {
        headerAlign: "center",
        field: 'email', headerName: 'Email', align: "center", width: 350
    },
    {
        headerAlign: "center",
        field: 'parsedDate',
        headerName: 'Date Of Birth',
        align: 'center',
        width: 250,
        valueGetter: (params) =>
            params.row.dob ? new Date(params.row.dob).toLocaleDateString() : null
    },
    {
        headerAlign: "center",
        field: 'status', headerName: 'Level', align: "center", width: 350
    },
    {
        headerAlign: "center",
        field: 'dob',
        headerName: 'Date',
        type: 'date',
        align: "center", width: 150,
        hide: true
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


const AttendanceStats = () => {
    const [selected, setSelected] = useState([])
    const [date, setDate] = useState("")
    const [helper, setHelper] = useState("")
    const [attendees, setAttendees] = useState([])
    const [absentees, setAbsentees] = useState([])
    const [whichStat, setWhichStat] = useState(true)
    const branchId = useSelector(state => state.branch.branchId)


    const getAttendance = async (branchId = "", date = "") => {
        try {
            const response = await api.get("/hr/attendance/getStats/", {
                params: {
                    branchId: branchId,
                    date: date
                }
            })
            const data = await response.data
            const message = data.message
            setHelper(message)
            const isAvailable = data.data.isSuccess
            let rows = data.data.data
            let attendees = rows.attendees
            let absentees = rows.absentees
            if (isAvailable) {
                attendees = attendees.filter((row, index, arr) => index === arr.findIndex((item) => row.id === item.id))
                absentees = absentees.filter((row, index, arr) => index === arr.findIndex((item) => row.id === item.id))
                setAbsentees(absentees)
                setAttendees(attendees)
            } else {
                setAbsentees([])
                setAttendees([])
            }
        } catch (error) {
            const data = await error.response.data
            const message = await data.message
            setHelper(message)
            setAbsentees([])
            setAttendees([])

        }
    }

    useEffect(() => {
        getAttendance(branchId, date)
    }, [branchId, date])



    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <FormControlLabel
                    control={<Switch
                        checked={whichStat}
                        onChange={() => setWhichStat(!whichStat)}
                    />}
                    label={whichStat ? 'Attendees' : 'Absentess'}
                    labelPlacement="start"
                    sx={{ margin: '1rem', justifySelf: 'flex-start' }}
                />
                <_TextField
                    id="date"
                    label="Search By Date"
                    type="date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    name="date"
                    shrink={true}
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    margin='normal'
                    sx={{
                        padding: 2,
                        width: 1 / 5
                    }}
                    variant="standard"
                    focused={true}
                    fullwidth={false}
                />
                <BranchField container={{ display: 'flex' }} sx={{ margin: '1rem', width: '25rem' }} />

            </Box>

            <div style={{ display: 'flex' }}>
                <div style={{ height: '70vh', width: '100%' }}>
                    <DataGrid
                        rows={whichStat ? attendees : absentees}
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

export default AttendanceStats