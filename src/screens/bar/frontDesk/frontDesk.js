import React, { useState, useEffect, useMemo } from "react";
import { Button, Typography, Box, Divider, Switch, FormControlLabel, Autocomplete, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import { DataGrid } from '@mui/x-data-grid';
import CustomerDetailsSection from "../../../components/customerDetailsSections";
import { helps, helpsAutoFill, errs, errsAutoFill, vals, onChangesAutoFill } from '../../../helpers/customerDetailsProps'
import { useSelector, useDispatch } from "react-redux";
import BeverageField from "../../../components/beveragesField";
import cusAutoFill from "../../../redux/slicers/cusAutoFill";
import api from "../../../api/api";
import { clearFieldsAsync, setNameAsync, setCostAsync, setPriceAsync, setQuantityAsync, setStockAsync, setTypeAsync } from "../../../redux/slicers/beverage";

const columns = [
    { field: 'id', headerName: 'ID', align: "center", width: 100 },
    { field: 'type', headerName: 'Type', align: "center", width: 200 },
    { field: 'name', headerName: 'Drink', align: "center", width: 200 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', align: "center", width: 100 },
    { field: 'units', headerName: 'Units', type: 'number', align: "center", width: 100 },
    {
        field: 'price',
        headerName: 'Total Price',
        type: 'number',
        align: "center", width: 250,
    },
];

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const FrontDesk = ({ index, value }) => {
    const [newCus, setnewCus] = useState(true);
    const [cart, setCart] = useState([]);
    const [selected, setSelected] = useState([])
    const [total, setTotal] = useState(0);
    const customerAutoFill = useSelector(state => state.cusAutoFill.cValues)
    const cusName = customerAutoFill.cName
    const cusIdentity = customerAutoFill.identityId
    const cusId = cusAutoFill.cId
    const mobileNo = customerAutoFill.mobileNo
    const beverage = useSelector(state => state.beverage)
    const type = beverage.type
    const name = beverage.name
    const stock = beverage.stock
    const cost = beverage.cost
    const quantity = beverage.quantity
    const price = beverage.price
    const [branchId, setBranchId] = useState("")
    const [units, setUnits] = useState(0)
    const [enablePayNow, setEnablePayNow] = useState(false)
    const [enableAddToBill, setEnableAddToBill] = useState(false)
    const [loading, setLoading] = useState(false)
    const [helper, setHelper] = useState("")
    const [whichSubmit, setWhichSubmit] = useState("")
    const dispatch = useDispatch()


    useEffect(async () => {
        const user = await window.localStorage.getItem("@user")
        const data = await JSON.parse(user)
        const branchId = await data.branchId
        setBranchId(branchId)
    }, [])

    const barPaymentSchema = Yup.object({
        name: Yup.string('Enter Your Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        mobile: Yup.number('Enter A Mobile Phone Number')
            .required("mobile no Required"),
        identity: Yup.string('Enter An NIC ID Or Passport ID')
            .min(7, "Too Short")
            .required("Enter An NIC ID Or Passport ID"),
        purchase: Yup.array().of(Yup.object().shape({
            type: Yup.string().required(),
            name: Yup.string().required(),
            units: Yup.number().required(),
            quantity: Yup.string().required(),
            price: Yup.number().required(),
            cost: Yup.number().required()
        }))
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            identity: "",
            purchase: [
                {
                    type: "",
                    name: "",
                    units: 0,
                    quantity: "",
                    price: "",
                    cost: ""
                }
            ],
        },
        validationSchema: barPaymentSchema,
        onSubmit: val => handlePay(val)
    })
    const handleCart = (itemType = type, itemName = name, itemQuantity = quantity, noOfUnits = units, itemPrice = price, itemCost = cost) => {
        if (itemType && itemName && itemQuantity && noOfUnits && itemPrice && itemCost) {
            const pricePerUnit = itemPrice

            const isAvailableId = cart.some(item => item.type === itemType && item.name === itemName && item.quantity === itemQuantity)
            let amount
            let expense

            if (isAvailableId) {
                // console.log(typeof isAvailableId)
                let arr = cart
                let object = arr.find(item => item.type === type && item.name === name && item.quantity === itemQuantity)
                let index = arr.findIndex(item => item === object)
                let number = Number(object.units) + Number(units)
                if (number < stock) {
                    object.units = number
                    object.price = Number((units * pricePerUnit).toFixed(2))
                    amount = Number((pricePerUnit * object.units).toFixed(2))
                    object.cost = Number((itemCost * object.units).toFixed(2))
                    setTotal(prev => prev + amount)
                } else {
                    const intialTotal = total
                    const reduce = Number((object.units * pricePerUnit).toFixed(2))
                    object.units = stock
                    object.price = Number((object.units * pricePerUnit).toFixed(2))
                    amount = Number((pricePerUnit * object.units).toFixed(2))
                    object.cost = Number((itemCost * object.units).toFixed(2))
                    const reducedAmount = intialTotal - reduce + amount
                    setTotal(reducedAmount)
                }
                let arr1 = [...arr.slice(0, index), object, ...arr.slice(index + 1, arr.length)]
                setCart(arr1)
                dispatch(setTypeAsync())
                dispatch(setNameAsync())
                dispatch(setQuantityAsync())
                dispatch(setPriceAsync())
                dispatch(setCostAsync())
            } else {
                amount = Number((pricePerUnit * units).toFixed(2))
                expense = Number((itemCost * units).toFixed(2))
                setCart(prev => [...prev, { id: prev.length, type: itemType, name: itemName, quantity: itemQuantity, units: noOfUnits, cost: expense, price: amount }])
                setTotal(prev => prev + amount)
                dispatch(setTypeAsync())
                dispatch(setNameAsync())
                dispatch(setQuantityAsync())
                dispatch(setPriceAsync())
                dispatch(setCostAsync())
            }

            setUnits(0)
        }
    }

    useMemo(() => {
        if (cart.length > 0) {
            formik.setFieldValue('purchase', cart)
        } else {
            formik.setFieldValue('purchase', [
                {
                    type: "",
                    drink: "",
                    units: 0,
                    quantity: "",
                    price: "",
                    cost: ""
                }
            ])
        }
    }, [cart])

    useMemo(() => {
        if (formik.isValid) {
            setEnablePayNow(true)
            setEnableAddToBill(true)
        } else {
            setEnablePayNow(false)
            setEnableAddToBill(false)
        }
    }, [formik.isValid])

    const handleCustomers = () => {
        if (!newCus) {
            const isValues = !Object.values(customerAutoFill).some(value => value === "")
            formik.setFieldValue('name', cusName)
            formik.setFieldValue('mobile', mobileNo)
            formik.setFieldValue('identity', cusIdentity)
        }
    }

    useMemo(() => {
        handleCustomers()
    }, [customerAutoFill])

    const handlePay = async (val) => {
        const body = {
            name: val.name,
            mobileNo: val.mobile,
            identityId: val.identity,
            purchase: val.purchase,
            branchId: branchId,
            total: total
        }
        const typeOfPay = whichSubmit
        setWhichSubmit("")
        // setLoading(true)
        if (typeOfPay === "Pay Now") {
            setEnableAddToBill(false)
            try {
                const response = await api.post("/bar/payNow/", body)
                const data = await response.data
                const message = await data.message
                const res = await data.data
                const isSuccess = await data.isSuccess
                setHelper(message)
            } catch (error) {
                const data = error.response.data
                const message = data.message
                const res = data.data
                setHelper(message)
            }

            setTotal(0)
            setCart([])
            setLoading(false)
        }
        // else if (typeOfPay === "Add To Bill") {
        //     setEnablePayNow(false)
        // }

    }

    if (index !== value) return null
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
            }
            }
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
                <CustomerDetailsSection
                    helpers={{ helps: helps(formik), helpsAutoFill: helpsAutoFill(formik) }}
                    errors={{ errs: errs(formik), errsAutoFill: errsAutoFill(formik) }}
                    onchanges={{ onChangesAutoFill: onChangesAutoFill(formik, { cusName, cusId }), handleChange: formik.handleChange }}
                    values={vals(formik)}
                    width={1 / 3}
                    newCus={newCus ? true : false}
                    oldCus={!newCus ? true : false}
                />
                <Divider orientation="vertical" flexItem variant="fullWidth" sx={{ alignContent: 'space-evenly', margin: '0 5rem' }} />
                <Box sx={{ width: 2 / 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <BeverageField
                            container={{ display: 'flex' }}
                            sx={{ margin: '1rem', width: '10rem' }}
                            branchId={branchId}
                        />
                        <_TextField
                            label="Units"
                            pHolder="1"
                            required
                            type='number'
                            shrink={true}
                            name="units"
                            sx={{ width: '10rem' }}
                            margin="none"
                            // error={formik.touched.purchase.units && Boolean(formik.errors.purchase.units)}
                            // helper={formik.touched.purchase.units && formik.errors.purchase.units}
                            value={units}
                            onChange={(e) => e.target.value <= stock ? setUnits(e.target.value) : null}
                        />
                    </Box>
                    <Button variant="contained" type="button" onClick={() => handleCart()}>Add To Cart</Button>
                    <Box sx={{ minHeight: 400, width: '100%' }}>
                        <DataGrid
                            rows={cart}
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

                            <Button variant="contained" type='submit' sx={{ marginRight: '2rem' }} onClick={() => setWhichSubmit("Pay Now")} disabled={loading && enablePayNow ? true : enablePayNow ? false : true} >{loading && enablePayNow ? "Loading" : "Pay Now"}</Button>
                            {/* <Button variant="contained" type='submit' sx={{ marginRight: '2rem' }} onClick={() => setWhichSubmit("Add To Bill")} disabled={loading && enableAddToBill ? true : enableAddToBill ? false : true} >{loading && enableAddToBill ? "Loading" : "Add To Bill"}</Button> */}
                        </Box>
                    </Box>
                </Box>


            </Box>

        </form >
    )
}

export default FrontDesk