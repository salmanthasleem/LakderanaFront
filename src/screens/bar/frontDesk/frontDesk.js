import React, { useState } from "react";
import { Button, Typography, Box, Divider, Switch, FormControlLabel, Autocomplete, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import CustomerRegistration from '../../customer/customerRegistration/customerRegistration'
import SearchByCustomer from '../../paymentsAndServices/room/searchByCustomer'
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', align: "center", width: 50 },
    { field: 'type', headerName: 'Type', align: "center", width: 100 },
    { field: 'drink', headerName: 'Drink', align: "center", width: 100 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', align: "center", width: 100 },
    {
        field: 'price',
        headerName: 'Price',
        type: 'number',
        align: "center", width: 70,
    },
];

const price = {
    Alcohol: [
        {
            name: "Coke",
            price: 100
        },
        {
            name: "Fanta",
            price: 80
        },
        {
            name: "Sprite",
            price: 90
        },
    ],
    Soda: [
        {
            name: "Coke",
            price: 95
        },
        {
            name: "Fanta",
            price: 75
        },
        {
            name: "Sprite",
            price: 80
        },
    ]
}

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const FrontDesk = ({ index, value }) => {
    const [newCus, setnewCus] = useState(true);
    const [liquor, setLiqour] = useState([]);
    const [selected, setSelected] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const customerRegisterSchema = Yup.object({
        name: Yup.string('Enter Your Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        mobile: Yup.number('Enter A Mobile Phone Number')
            .min(9, "Enter A Valid Mobile Number")
            .max(15, "Enter A Valid Mobile Number")
            .required("Date Of Birth Required"),
        id: Yup.string('Enter An NIC ID Or Passport ID')
            .min(7, "Too Short")
            .required("Enter An NIC ID Or Passport ID"),
        type: Yup.string("Choose A Beverage Type").required("Specify A Beverage Type"),
        drink: Yup.string("Choose A Drink").required("Specify A Drink"),
        quantity: Yup.number("Enter Number of Drinks").required("Specify Quantity").min(1),


    })

    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            id: "",
            type: "Alcohol",
            drink: "Coke",
            quantity: ""
        },
        validationSchema: customerRegisterSchema,
        onSubmit: val => console.log(val)
    })
    const handleLiqour = (type = formik.values.type, drink = formik.values.drink, quantity = formik.values.quantity) => {
        if (type !== "" && drink !== "" && quantity !== "") {
            const cost = price[type].find(item => item.name === drink).price
            const amount = Number((cost * quantity).toFixed(2))
            console.log(cost)
            const isAvailableId = liquor.some(item => item.type === type && item.drink === drink)


            if (isAvailableId) {
                // console.log(typeof isAvailableId)
                let arr = liquor
                let object = arr.filter(item => item.type === type && item.drink === drink)[0]
                let index = arr.findIndex(item => item === object)
                let number = object.quantity + quantity
                object.quantity = number
                object.price = Number((number * cost).toFixed(2))
                let arr1 = [...arr.slice(0, index), object, ...arr.slice(index + 1, arr.length)]
                setLiqour(arr1)

            } else {
                setLiqour(prev => [...prev, { id: prev.length, type: type, drink: drink, quantity: quantity, price: amount }])
            }

            setTotal(prev => prev + amount)

        }
    }
    if (index !== value) return null
    return (
        <form
            onSubmit={formik.handleSubmit}
            style={{
                display: 'flex',
                width: '100%',
                margin: '2rem auto',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', margin: '2rem auto', width: '100%', }}>
                <Typography variant="h4" component="h3" sx={{ transform: 'translateX(-100%)' }}>Customer Details</Typography>
                <Typography variant="h4" component="h3" sx={{ transform: 'translateX(-50%)' }}>Bar</Typography>

            </Box>
            <FormControlLabel
                control={<Switch
                    checked={newCus}
                    onChange={() => setnewCus(!newCus)}
                />}
                label="New Customer"
                labelPlacement="start"
                sx={{ alignSelf: 'flex-start', marginLeft: '5rem', justifySelf: 'center' }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '90%' }}>
                <Box sx={{ width: 1 / 3 }}>
                    {newCus && <CustomerRegistration width={'100%'} />}
                    {!newCus && <SearchByCustomer />}
                </Box>
                <Divider orientation="vertical" flexItem variant="fullWidth" sx={{ alignContent: 'space-evenly', margin: '0 5rem' }} />
                <Box sx={{ width: 2 / 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Autocomplete
                            disablePortal
                            options={["Alcohol", "Soda"]}
                            renderInput={(params) => <TextField {...params} label="Type Of Drink" />}
                            sx={{ width: 2 / 7 }}
                            error={formik.touched.type && Boolean(formik.errors.type)}
                            helper={formik.touched.type && formik.errors.type}
                            value={formik.values.type}
                            onChange={(e, val) => formik.setFieldValue("type", val !== null ? val : formik.values.type)}
                            initialValues={"Alcohol"}
                        />
                        <Autocomplete
                            disablePortal
                            options={["Coke", "Fanta", "Sprite"]}
                            renderInput={(params) => <TextField {...params} label="Drinks" />}
                            sx={{ width: 2 / 7 }}
                            error={formik.touched.drink && Boolean(formik.errors.drink)}
                            helper={formik.touched.drink && formik.errors.drink}
                            value={formik.values.drink}
                            onChange={(e, val) => formik.setFieldValue("drink", val !== null ? val : formik.values.drink)}
                        />
                        <_TextField
                            label="Quantity"
                            pHolder="1"
                            required
                            type='number'
                            shrink={true}
                            name="quantity"
                            sx={{ width: 2 / 7 }}
                            margin="none"
                            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                            helper={formik.touched.quantity && formik.errors.quantity}
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', margin: '2rem 0' }}>
                        <Autocomplete
                            disablePortal
                            options={[123, 464, 765]}
                            renderInput={(params) => <TextField {...params} label="Branch" />}
                            sx={{ width: 2 / 5 }}
                        />
                        <Button variant="contained" type="button" onClick={() => handleLiqour()}>Add To Cart</Button>
                    </Box>
                    <Box sx={{ minHeight: 400, width: '100%' }}>
                        <DataGrid
                            rows={liquor}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            checkboxSelection
                            disableColumnFilter
                            onSelectionModelChange={(...e) => setSelected(e[0])}
                            isRowSelectable={(item) => selected.length > 1 ? false : true}

                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: 1 }}>
                        <Typography variant="h4" component="h3" sx={{ width: 1 / 2 }}>{`Total : ${total}`}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: 1, height: '5rem', alignItems: 'center' }}>

                            <Button variant="contained" type='submit' sx={{ marginRight: '2rem' }}>Pay Now</Button>
                            <Button variant="contained" type='submit' sx={{ marginRight: '2rem' }}>Add To Bill</Button>
                        </Box>
                    </Box>
                </Box>


            </Box>

        </form >
    )
}

export default FrontDesk