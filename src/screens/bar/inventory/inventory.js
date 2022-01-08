import React, { useState, useEffect } from "react";
import _TextField from "../../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Button, Typography, Modal, Box, TextField, Autocomplete } from "@mui/material";
import api from "../../../api/api";
import BranchField from "../../../components/branchField";
import BeverageField from "../../../components/beveragesField";
import { useSelector, useDispatch } from "react-redux";
import BarAddItem from "../../../components/bar/addItemModal";
import RestockItem from "../../../components/bar/restockModal";
import { setModalOpen } from "../../../redux/slicers/addItemModalSlice";
import { setRestockModalOpen, setParamsAsync } from "../../../redux/slicers/restockItem";
import { CSVLink } from "react-csv";

const columns = [

    { field: 'id', headerName: 'Item ID', align: "center", width: 100 },
    { field: 'beverageId', headerName: 'Beverage Id', align: "center", width: 200 },
    { field: 'branchId', headerName: 'Branch Id', align: "center", width: 100 },
    { field: 'name', headerName: 'Name', align: "center", width: 200 },
    { field: 'type', headerName: 'Type', align: "center", width: 200 },
    {
        field: 'quantity',
        headerName: 'Quantity',
        align: "center", width: 200,
    },
    {
        field: 'stock',
        headerName: 'In-Stock',
        align: "center", width: 200,
    },
    {
        field: 'cost',
        headerName: 'Cost Per Unit',
        align: "center", width: 200,
    },
    {
        field: 'price',
        headerName: 'Price Per Unit',
        align: "center", width: 200,
    },
    {
        field: 'isAvailable',
        headerName: 'Availabiltiy',
        align: "center", width: 100,
    },
    // {
    //     field: 'stockAvailability',
    //     headerName: 'Status',
    //     width: 250,
    //     valueGetter: (params) =>
    //         `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''
    //         }`,
    // },
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


const Inventory = () => {
    const [selected, setSelected] = useState([])
    const [inventory, setInventory] = useState([])
    const dispatch = useDispatch()
    const beverage = useSelector(state => state.beverage)
    const branchId = useSelector(state => state.branch.branchId)
    const restockBarItem = useSelector(state => state.restockBarItem)
    const reStockedStock = restockBarItem.itemParams.stock
    const reStockedBranch = restockBarItem.itemParams.branchId
    const name = beverage.name
    const type = beverage.type
    const price = beverage.price
    const quantity = beverage.quantity
    const cost = beverage.cost


    const getItems = async (branchId) => {
        try {
            const response = await api.get("/bar/getStock/", {
                params: {
                    branchId: branchId || "",
                    name: name || "",
                    type: type || "",
                    price: price || "",
                    quantity: quantity || "",
                    cost: cost || ""
                }
            })
            const data = await response.data
            const message = await data.message
            const isAvailable = data.data.isAvailable
            if (isAvailable) {
                const rows = await data.data.data
                const filter = rows.map(row => ({ id: row.barItemId, ...row }))
                setInventory(filter)
            } else {
                setInventory([])
            }
        } catch (error) {
            const data = await error.response.data.data
            const isAvailable = data.isAvailable
            if (!isAvailable) {
                setInventory([])
            }
        }
    }

    const handleOpenAddItem = () => dispatch(setModalOpen(true))

    const handleOpenRestock = () => dispatch(setRestockModalOpen(true))

    const handleRow = ({ beverageId, stock, branchId, name, type, quantity }) => {
        const params = { stock, branchId, itemId: beverageId, name, type, quantity }
        dispatch(setParamsAsync(params))
    }

    useEffect(() => {
        if (branchId) {
            getItems(branchId)
        }
    }, [name, type, price, quantity])

    useEffect(async () => {
        const user = await window.localStorage.getItem("@user")
        const userData = await JSON.parse(user)
        const empStatus = await userData.empStatus
        if (branchId || empStatus === "Owner") {
            getItems(branchId)
        }
    }, [branchId])

    useEffect(() => {
        if (reStockedBranch && reStockedStock) {
            getItems(reStockedBranch)
        }
    }, [reStockedBranch, reStockedStock])

    useEffect(async () => {
        const user = await window.localStorage.getItem("@user")
        const data = JSON.parse(user)
        const defaultBranchId = data.branchId
        getItems(defaultBranchId)
    }, [])

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <BranchField container={{ display: 'flex' }} sx={{ margin: '1rem' }} />
                <BeverageField container={{ display: 'flex' }} sx={{ margin: '1rem' }} sx={{ width: '15rem', margin: '1rem' }}
                    branchId={branchId}
                />
            </Box>

            <div style={{ display: 'flex' }}>
                <div style={{ height: '70vh', width: '100%' }}>
                    <DataGrid
                        rows={inventory}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true}
                        onRowClick={({ row }) => handleRow(row)}
                    />
                </div>

            </div>

            <div style={{ width: '100%', display: "flex", justifyContent: 'flex-start', alignItems: 'center', height: '4rem', marginLeft: '1rem' }}>
                <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} onClick={handleOpenAddItem}>Add Item</Button>
                {selected.length > 0 && <Button variant="contained" color="primary" type='submit' size="large" sx={{ marginRight: 1 }} onClick={handleOpenRestock}>Restock Item</Button>}
                {inventory &&
                    <Button
                        variant="contained" color="primary" type='button' size="large" sx={{ marginRight: 1 }} disabled={inventory.length > 0 ? false : true}><CSVLink data={inventory} style={{ textDecoration: 'none', color: 'white' }} >Download Table</CSVLink></Button>}
            </div>
            <BarAddItem />
            <RestockItem />
        </>
    )
}

export default Inventory