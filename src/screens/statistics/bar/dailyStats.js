import React, { useEffect, useState } from "react";
import _TextField from "../../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import BranchField from '../../../components/branchField'
import { useSelector } from "react-redux";
import api from "../../../api/api";
import { CSVLink } from "react-csv";
import { Button } from "@mui/material";


const columns = [

    {
        headerAlign: "center",
        field: 'id', headerName: 'ID', align: "center", width: 200
    },
    {
        headerAlign: "center",
        field: 'branchName', headerName: 'Branch Name', align: "center", width: 350
    },
    {
        headerAlign: "center",
        field: 'location', headerName: 'Branch Location', type: 'number', align: "center", width: 350
    },
    {
        headerAlign: "center",
        field: 'parsedDate',
        headerName: 'Date',
        align: 'center',
        width: 250,
        valueGetter: (params) =>
            params.row.date ? new Date(params.row.date).toLocaleDateString() : null
    },
    {
        headerAlign: "center",
        field: 'date',
        headerName: 'Date',
        type: 'date',
        align: "center", width: 150,
        hide: true
    },
    {
        headerAlign: "center",
        field: 'income',
        headerName: 'Income',
        type: 'number',
        align: "center", width: 300,
    },
    {
        headerAlign: "center",
        field: 'expense',
        headerName: 'Expense',
        type: 'number',
        align: "center", width: 300,
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


const BarStatsDaily = () => {
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState("")
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [helper, setHelper] = useState("")
    const [bars, setBars] = useState([])
    const branchId = useSelector(state => state.branch.branchId)


    const getBar = async (branchId = "", date = "") => {
        try {
            const response = await api.get("/stats/getBar/", {
                params: {
                    branchId: branchId,
                    date: date
                }
            })
            const data = await response.data
            const message = data.message
            setHelper(message)
            const isAvailable = data.data.isAvailable
            let rows = data.data.rows
            if (isAvailable) {
                rows = rows.filter((row, index, arr) => index === arr.findIndex((item) => row.id === item.id))
                setBars([...new Set(rows)])
            } else {
                setBars([])
            }
        } catch (error) {
            const data = await error.response.data
            const message = await data.message
            setHelper(message)
            setBars([])

        }
    }

    useEffect(() => {
        getBar(branchId, date)
    }, [branchId, date])



    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
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
                        rows={bars}
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
            <div style={{ width: '100%', display: "flex", justifyContent: 'flex-start', alignItems: 'center', height: '4rem', marginLeft: '1rem' }}>
                {bars &&
                    <Button
                        variant="contained" color="primary" type='button' size="large" sx={{ marginRight: 1 }} disabled={bars.length > 0 ? false : true} ><CSVLink data={bars} style={{ textDecoration: 'none', color: 'white' }} >Download Table</CSVLink></Button>}
            </div>
        </>
    )
}

export default BarStatsDaily