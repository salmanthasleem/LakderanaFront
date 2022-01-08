import React, { useState, useEffect } from "react";
import _TextField from "../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Box, Button } from "@mui/material";
import BranchField from "../../components/branchField";
import { useSelector } from "react-redux";
import api from "../../api/api";
import { CSVLink } from "react-csv";


const columns = [
    {
        headerAlign: "center",
        field: 'id', headerName: 'ID', align: "center", width: 200
    },
    {
        headerAlign: "center",
        field: 'income', headerName: 'Income', align: "center", width: 350
    },
    {
        headerAlign: "center",
        field: 'expense', headerName: 'Expense', align: "center", width: 350
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
        field: 'description', headerName: 'Description', align: "center", width: 600
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


const IncomeStats = () => {
    const [selected, setSelected] = useState([])
    const [date, setDate] = useState("")
    const [helper, setHelper] = useState("")
    const [description, setDescription] = useState("")
    const [incomes, setIncomes] = useState([])
    const branchId = useSelector(state => state.branch.branchId)


    const getIncomes = async (branchId = "", date = "", description = "") => {
        try {
            const response = await api.get("/stats/getIncome/", {
                params: {
                    branchId: branchId,
                    date: date,
                    description
                }
            })
            const data = await response.data
            const message = data.message
            setHelper(message)
            const isAvailable = data.data.isAvailable
            let rows = data.data.rows
            if (isAvailable) {
                rows = rows.filter((row, index, arr) => index === arr.findIndex((item) => row.id === item.id))
                setIncomes(rows)
            } else {
                setIncomes([])
            }
        } catch (error) {
            const data = await error.response.data
            const message = await data.message
            setHelper(message)
            setIncomes([])

        }
    }

    useEffect(() => {
        getIncomes(branchId, date, description)
    }, [branchId, date, description])



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
                <_TextField
                    id="description"
                    label="Search By Description"
                    type="text"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    name="description"
                    shrink={true}
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    margin='normal'
                    sx={{
                        padding: 2,
                        width: 1 / 5
                    }}
                    variant="standard"
                    focused={true}
                    fullwidth={false}
                />

            </Box>

            <div style={{ display: 'flex' }}>
                <div style={{ height: '70vh', width: '100%' }}>
                    <DataGrid
                        rows={incomes}
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
                {incomes &&
                    <Button
                        variant="contained" color="primary" type='button' size="large" sx={{ marginRight: 1 }} disabled={incomes.length > 0 ? false : true} ><CSVLink data={incomes} style={{ textDecoration: 'none', color: 'white' }} >Download Table</CSVLink></Button>}
            </div>
        </>
    )
}

export default IncomeStats