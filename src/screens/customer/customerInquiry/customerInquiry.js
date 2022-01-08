import React, { useState, useEffect } from "react";
import _TextField from "../../../components/auth/textField"
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, TextField, Modal, Fade, Backdrop, Box } from "@mui/material";
import api from '../../../api/api'
import useAuth from "../../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { setModalOpen, setReload, setStatusModal } from "../../../redux/slicers/inquiry";
import AddInquiry from "./addInquiry";
import InsertStatus from "./insert";

const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'cId', headerName: 'Customer Id', width: 200 },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'mobile', headerName: 'Mobile No', width: 200 },
    {
        field: 'identity',
        headerName: 'Identity/Social Security No',
        width: 250,
    },
    {
        field: 'title',
        headerName: 'Title',
        sortable: false,
        width: 350,
    },
    {
        field: 'status',
        headerName: 'Status',
        sortable: false,
        width: 300,
    },
];



const CustomerInquiry = () => {
    const [selected, setSelected] = useState([])
    const [allRows, setAllRows] = useState([])
    const [query, setQuery] = useState("")
    const [description, setDescription] = useState("")
    const [branchId, setBranchId] = useState("")
    const [selectedRow, setSelectedRow] = useState(null)
    const auth = useAuth()
    const dispatch = useDispatch()
    const reload = useSelector(state => state.inquiry.reload)
    const statusModalOpen = useSelector(state => state.inquiry.statusModal)


    const handleOpen = () => dispatch(setModalOpen(true));

    const handleOpenStatus = () => dispatch(setStatusModal(true))


    useEffect(async () => {
        const branchId = await JSON.parse(auth.userData).branchId
        setBranchId(branchId)
    }, [])

    const getList = async () => {
        try {
            if (reload) {
                const response = await api.get(`/customer/inquiry/`, {
                    params: {
                        branchId: branchId,
                        query: query
                    }
                })
                const data = response.data.data.rows
                const rows = data.map(row => ({
                    id: row.id,
                    cId: row.customerId,
                    name: row.name,
                    mobile: row.mobileNo,
                    identity: row.identityId,
                    title: row.title,
                    description: row.description,
                    status: row.status
                }))
                setAllRows(rows)
                dispatch(setReload(false))
            }
        } catch (error) {
            dispatch(setReload(true))
        }
    }

    useEffect(() => {
        window.addEventListener('focusin', () => dispatch(setReload(true)))

        return () => {
            window.removeEventListener('focusin', () => dispatch(setReload(true)))
        }
    }, [])
    useEffect(async () => {
        await getList()
    }, [branchId, query, reload])

    const handleRowclick = (row) => {
        if (selected.length === 0) {
            setSelectedRow(row)
        } else {
            setSelectedRow(null)
        }
    }

    useEffect(() => {
        if (selected.length > 0) {
            const description = allRows.find(row => row.id === selected[0]).description || "Not Available"
            setDescription(description)
        }
    }, [selected])
    return (
        <>
            <TextField
                label="Search Customer"
                name="customer"
                placeholder="Search For Customers By Name"
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
                onChange={(e, val) => {
                    setQuery(e.target.value)
                    dispatch(setReload(true))
                }}
                fullWidth
            />
            <div style={{ display: 'flex' }}>
                <div style={{ height: 400, width: '70%' }}>
                    <DataGrid
                        rows={allRows}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true
                        }
                        onRowClick={({ row }) => handleRowclick(row)}
                    />
                </div>
                <div style={{ width: '30%', margin: '10px' }}>
                    <Typography variant="h4" gutterBottom component="div" paragraph align='center'>
                        Description
                    </Typography>
                    <Typography variant="h5" gutterBottom component="div" paragraph align='center'>
                        {description}
                    </Typography>
                </div>

            </div>

            <div style={{ width: '100%', display: "flex", justifyContent: 'flex-start', alignItems: 'center', height: '4rem', marginLeft: '1rem' }}>
                <Button variant="contained" color="primary" type="button"
                    onClick={handleOpen} size="large"
                    sx={{ marginRight: 1 }} >Add Inquiry</Button>

                {selectedRow && <Button variant="contained" color="warning" type='submit'
                    onClick={handleOpenStatus} size="large"
                    sx={{ marginRight: 1 }}
                >Change Status</Button>}
            </div>

            <AddInquiry />
            {selectedRow && <InsertStatus row={{ ...selectedRow }} />}

        </>
    )
}

export default CustomerInquiry