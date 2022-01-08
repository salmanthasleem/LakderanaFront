import React, { useEffect, useState } from "react";
import { Button, Typography, Box, Divider, Switch, FormControlLabel, Autocomplete, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import CustomerDetailsSection from "../../../components/customerDetailsSections";
import { useSelector, useDispatch } from 'react-redux';
import { helps, helpsAutoFill, errs, errsAutoFill, vals, onChangesAutoFill } from '../../../helpers/customerDetailsProps'
import { setcValuesAsync } from "../../../redux/slicers/cusAutoFill";
import { setBranch } from "../../../redux/slicers/branchSlice"
import api from '../../../api/api'
import BranchField from "../../../components/branchField";
import { load } from "dotenv";

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const ReserveRoom = ({ index, value }) => {
    const [newCus, setnewCus] = useState(true);
    const [food, setFood] = useState({
        breakfast: false,
        lunch: false,
        dinner: false
    });
    const [loadedData, setLoadedData] = useState([])
    const [types, setTypes] = useState([])
    const [numbers, setNumbers] = useState([])
    const [adults, setAdults] = useState([])
    const [childs, setChilds] = useState([])
    const customerAutoFill = useSelector(state => state.cusAutoFill.cValues)
    const cusName = customerAutoFill.cName
    const cusId = customerAutoFill.cId
    const mobileNo = customerAutoFill.mobileNo
    const identityId = customerAutoFill.identityId
    const branchId = useSelector(state => state.branch.branchId)
    const [helper, setHelper] = useState("")
    const [buyNow, setBuyNow] = useState(false)
    const dispatch = useDispatch()


    const handleFood = (breakfast = food.breakfast, lunch = food.lunch, dinner = food.dinner) => {
        setFood({ breakfast, lunch, dinner })
    }

    const reserveRoomSchema = Yup.object({
        name: Yup.string('Enter Your Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        mobile: Yup.number('Enter A Mobile Phone Number')
            .test('len', 'Enter A Value With 9 Or More Digits', (val) => val && val.toString().length >= 9)
            .required("Date Of Birth Required"),
        identity: Yup.string('Enter An NIC ID Or Passport ID')
            .min(7, "Too Short")
            .required("Enter An NIC ID Or Passport ID"),
        dateIn: Yup.date('Specify Check In Date').required('Check In Date Missing'),
        dateOut: Yup.date('Specify Check Out Date')
            .when('dateIn', (dateIn, Schema) => {
                let endDate = new Date(dateIn)
                const day = endDate.getDate() + 1
                endDate.setDate(day)
                return (dateIn && Schema.min(endDate))
            })
            .required('Check Out Date Missing'),
        minAdults: Yup.number('Specify Minimum Number Of Adults')
            .min(1, "Enter A  Number")
            .max(8, "Too Crowded"),
        minChildren: Yup.number('Specify Minimum Number Of Children')
            .min(1, "Enter A  Number")
            .max(5, "Too Crowded"),
        pricePerNight: Yup.number('Price Per Night Missing')
            .min(1, "Enter A  Valid Value").required('Price Per Night Missing'),
        total: Yup.number('Total Cost Missing')
            .min(1, "Enter A  Valid Value").required('Total Cost Missing'),
        nights: Yup.number('Specify Length Of Stay')
            .min(1, "Enter A  Valid Value").max(30, "Maximum Number Of Nights is 30").required('length Of Stay Missing'),
        roomNo: Yup.number('Enter A Room Number')
            .max(1000, "Room Number Seems Too Long")
            .required("Room Number Is Required"),
        roomType: Yup.string('Select Or Specify A Room Type')
            .min(4, "Too Short")
            .required("Room Type Is Required"),
        beds: Yup.number('Enter A Number').min(0, "Enter A Valid Number").max(3, "Enter A Realistic Number").default(1),
        branchId: Yup.string('Select A Branch Id')
            .min(1, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),

    })

    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            identity: "",
            dateIn: "",
            dateOut: "",
            minAdults: "",
            minChildren: "",
            pricePerNight: "",
            nights: "",
            roomType: "",
            roomNo: "",
            beds: "",
            total: "",
            branchId: ""

        },
        validationSchema: reserveRoomSchema,
        onSubmit: val => handleSubmit(val)
    })

    const clearFields = () => {
        formik.setFieldValue('roomType', "")
        formik.setFieldValue('roomNo', "")
        formik.setFieldValue('minAdults', "")
        formik.setFieldValue('minChildren', "")
        formik.setFieldValue('pricePerNight', "")
        formik.setFieldValue('beds', "")
        formik.setFieldValue('nights', "")
        formik.setFieldValue('total', "")
    }

    const handleCustomers = () => {
        if (!newCus) {
            formik.setFieldValue('name', cusName)
            formik.setFieldValue('mobile', mobileNo)
            formik.setFieldValue('identity', identityId)
        }
    }

    useEffect(() => {
        handleCustomers()
    }, [customerAutoFill])

    const getRooms = async () => {
        const user = await window.localStorage.getItem("@user")
        const userParsed = await JSON.parse(user)
        const employeeId = await userParsed.employeeId
        try {
            console.log(branchId)
            const response = await api.get("/manage/room/getFilter/", {
                params: {
                    branchId: branchId,
                    employeeId: employeeId
                }
            })
            const message = await response.data.message
            const data = await response.data.data
            const isRoom = await data.isRoom
            const rows = data.rows
            const filter = rows.filter(room => room.isBooked === 0)
            if (isRoom) {
                setLoadedData(filter)
            } else {
                setLoadedData([])
                clearFields()
            }
            setHelper(message)
        } catch (error) {
            const response = error.response.data
            const message = response.message
            const data = response.data
            const isRoom = data.isRoom
            setLoadedData([])
            clearFields()
            setHelper(message)
        }
        setTimeout(() => setHelper(""), 2000)
    }

    useEffect(() => {
        getRooms()
    }, [branchId])

    useEffect(() => {
        if (branchId) {
            formik.setFieldValue('branchId', branchId)
        }
    }, [branchId])

    useEffect(() => {
        if (loadedData) {
            const types = loadedData.map((room) => room.type)
            const set = [...new Set(types)]
            setTypes(set)
        }
    }, [loadedData])

    useEffect(() => {
        const checkIn = new Date(formik.values.dateIn)
        const checkOut = new Date(formik.values.dateOut)
        if (checkIn instanceof Date && checkOut instanceof Date) {
            const inMonth = checkIn.getMonth()
            const inYear = checkIn.getFullYear()
            const inDays = checkIn.getDate()
            const outMonth = checkOut.getMonth()
            const outYear = checkOut.getFullYear()
            const outDays = checkOut.getDate()
            const diffYear = outYear - inYear
            const diffMonth = outMonth - inMonth
            const diffDays = outDays - inDays
            console.log(diffYear, diffMonth, diffDays)
            const TotalDays = diffDays + (diffMonth * 30) + (diffYear * 365)
            formik.setFieldValue('nights', TotalDays)
            if (formik.values.pricePerNight) {
                const totalPrice = formik.values.pricePerNight * TotalDays
                formik.setFieldValue('total', totalPrice)
            }
        } else {
            formik.setFieldValue('nights', "")
            formik.setFieldValue('total', "")
        }

    }, [formik.values.dateIn, formik.values.dateOut])


    const handleSwitch = () => {
        formik.setFieldValue('name', "")
        formik.setFieldValue('mobile', "")
        formik.setFieldValue('identity', "")
        setnewCus(!newCus)
    }

    useEffect(() => {
        if (Boolean(formik.errors)) {
            const meta = formik.getFieldMeta()
            const keys = Object.keys(meta.error)
            for (let i = 0; i < keys.length; i++) {
                setHelper(formik.errors[keys[i]])
                setTimeout(() => setHelper(""), 1500)
            }
        }

    }, [formik.errors])

    useEffect(() => {
        if (formik.isValid) {
            setHelper("All Fields Are Now Valid")
            setBuyNow(true)
            setTimeout(() => setHelper(""), 4000)
        } else {
            setBuyNow(false)
        }

    }, [formik.isValid])

    useEffect(() => {
        const roomType = formik.values.roomType
        if (types && roomType) {
            const numbers = loadedData.filter(room => room.type === roomType).map(room => room.roomNo)
            console.log(numbers)
            const set = [... new Set(numbers)]
            setNumbers(set)
        }
    }, [types, formik.values.roomType])

    useEffect(() => {
        const roomNo = formik.values.roomNo
        const roomType = formik.values.roomType
        if (numbers && roomNo && roomType) {
            if (loadedData) {
                const numbers = loadedData.filter(room => room.type === roomType && room.roomNo === roomNo)[0]
                const adult = numbers.minAdults
                const childs = numbers.minChildren
                const cost = numbers.pricePerNight
                const beds = numbers.beds
                const totalPrice = formik.values.nights * cost
                formik.setFieldValue('total', totalPrice)
                formik.setFieldValue('minAdults', adult)
                formik.setFieldValue('minChildren', childs)
                formik.setFieldValue('pricePerNight', cost)
                formik.setFieldValue('beds', beds)
                setTimeout(() => setHelper(""), 1000)
            } else {
                formik.setFieldValue('total', "")
                formik.setFieldValue('minAdults', "")
                formik.setFieldValue('minChildren', "")
                formik.setFieldValue('pricePerNight', "")
                formik.setFieldValue('beds', "")
                setTimeout(() => setHelper(""), 1000)
            }
        }
    }, [numbers, formik.values.roomNo])

    const handleRoomNoInput = (e, val) => {
        if (val === "") {
            formik.setFieldValue('roomNo', "")
            formik.setFieldValue('minAdults', "")
            formik.setFieldValue('minChildren', "")
            formik.setFieldValue('pricePerNight', "")
            formik.setFieldValue('beds', "")
        }
    }

    const handleRoomTypeInput = (e, val) => {
        if (val === "") {
            clearFields()
        }
    }
    const handleSubmit = async (val) => {
        const submitData = {
            name: val.name,
            mobileNo: val.mobile,
            identityId: val.identity,
            dateIn: val.dateIn,
            dateOut: val.dateOut,
            minAdults: val.minAdults,
            minChildren: val.minChildren,
            pricePerNight: val.pricePerNight,
            nights: val.nights,
            roomType: val.roomType,
            roomNo: val.roomNo,
            beds: val.beds,
            total: val.total,
            branchId: val.branchId

        }
        try {
            const response = await api.post("/manage/room/reserve/", submitData)
            const data = await response.data
            const message = data.message
            console.log(data.data)
            setHelper(message)
            dispatch(setcValuesAsync())
            dispatch(setBranch())
            formik.resetForm()
            await getRooms()
        } catch (error) {
            const data = error.response.data
            const message = data.message
            console.log(data.data)
            setHelper(message)
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
                <Typography variant="h4" component="h3" sx={{ transform: 'translateX(-50%)' }}>Room</Typography>

            </Box>
            <FormControlLabel
                control={<Switch
                    checked={newCus}
                    onChange={handleSwitch}
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <_TextField
                            id="date"
                            label="Check In Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name="dateIn"
                            shrink={true}
                            sx={{ width: 2 / 5 }}
                            error={formik.touched.dateIn && Boolean(formik.errors.dateIn)}
                            helper={formik.touched.dateIn && formik.errors.dateIn}
                            value={formik.values.dateIn}
                            onChange={formik.handleChange}
                        />
                        <_TextField
                            id="date"
                            label="Chech Out Date"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            name="dateOut"
                            shrink={true}
                            sx={{ width: 2 / 5 }}
                            error={formik.touched.dateOut && Boolean(formik.errors.dateOut)}
                            helper={formik.touched.dateOut && formik.errors.dateOut}
                            value={formik.values.dateOut}
                            onChange={formik.handleChange}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <BranchField sx={{ width: '18rem', margin: '1rem' }} container={{ display: 'flex' }} />
                        <Autocomplete
                            disablePortal
                            options={types}
                            renderInput={(params) => <TextField {...params} label="Room Type" />}
                            sx={{ width: '18rem', margin: '1rem' }}
                            disabled={branchId && formik.values.dateIn && formik.values.dateOut ? false : true}
                            onChange={(e, val) => formik.setFieldValue('roomType', val)}
                            value={formik.values.roomType}
                            onInputChange={handleRoomTypeInput}
                        />
                        <Autocomplete
                            disablePortal
                            options={numbers}
                            renderInput={(params) => <TextField {...params} label="Room Number" />}
                            sx={{ width: '18rem', margin: '1rem' }}
                            disabled={formik.values.roomType ? false : true}
                            onChange={(e, val) => formik.setFieldValue('roomNo', val)}
                            value={formik.values.roomNo}
                            onInputChange={handleRoomNoInput}
                        />
                        <_TextField
                            label="Number Of Beds"
                            pHolder="1"
                            required
                            type='number'
                            error={formik.touched.beds && Boolean(formik.errors.beds)}
                            helper={formik.touched.beds && formik.errors.beds}
                            shrink={true}
                            value={formik.values.beds}
                            onChange={formik.handleChange}
                            name="beds"
                            sx={{ width: '18rem' }}
                            disabled={true}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <_TextField
                            label="Number Of Adults"
                            pHolder="1"
                            required
                            type='number'
                            error={formik.touched.minAdults && Boolean(formik.errors.minAdults)}
                            helper={formik.touched.minAdults && formik.errors.minAdults}
                            shrink={true}
                            value={formik.values.minAdults}
                            onChange={formik.handleChange}
                            name="noAdults"
                            sx={{ width: 2 / 5 }}
                            disabled={true}
                        />
                        <_TextField
                            label="Number Of Childrens"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.minChildren && Boolean(formik.errors.minChildren)}
                            helper={formik.touched.minChildren && formik.errors.minChildren}
                            value={formik.values.minChildren}
                            onChange={formik.handleChange}
                            name="noChilds"
                            sx={{ width: 2 / 5 }}
                            disabled={true}
                        />
                    </Box>
                    <_TextField
                        label="Length Of Stay(Nights)"
                        pHolder="1"
                        required
                        type="number"
                        error={formik.touched.nights && Boolean(formik.errors.nights)}
                        helper={formik.touched.nights && formik.errors.nights}
                        value={formik.values.nights}
                        onChange={formik.handleChange}
                        name="nights"
                        disabled={true}
                    />
                    {/* <Box>
                        <Box sx={{ display: 'flex' }}>
                            <Box>

                                <FormControlLabel
                                    control={<Switch
                                        checked={food.breakfast}
                                        onChange={() => handleFood(!food.breakfast, food.lunch, food.dinner)}
                                    />}
                                    label="Breakfast"
                                    labelPlacement="start"
                                    sx={{ alignSelf: 'flex-start', marginLeft: '5rem', justifySelf: 'center' }}
                                />
                                <TextField
                                    defaultValue={1}
                                    disabled={!food.breakfast}
                                    label="No."
                                    size="small"
                                    type="number"
                                    min={1}

                                />
                            </Box>
                            <Box>

                                <FormControlLabel
                                    control={<Switch
                                        checked={food.lunch}
                                        onChange={() => handleFood(food.breakfast, !food.lunch, food.dinner)}
                                    />}
                                    label="Lunch"
                                    labelPlacement="start"
                                    sx={{ alignSelf: 'flex-start', marginLeft: '5rem', justifySelf: 'center' }}
                                />
                                <TextField
                                    defaultValue={1}
                                    disabled={!food.lunch}
                                    label="No."
                                    size="small"
                                    type="number"
                                    min={1}

                                />
                            </Box>
                            <Box>

                                <FormControlLabel
                                    control={<Switch
                                        checked={food.dinner}
                                        onChange={() => handleFood(food.breakfast, food.lunch, !food.dinner)}
                                    />}
                                    label="Dinner"
                                    labelPlacement="start"
                                    sx={{ alignSelf: 'flex-start', marginLeft: '5rem', justifySelf: 'center' }}
                                />
                                <TextField
                                    defaultValue={1}
                                    disabled={!food.dinner}
                                    label="No."
                                    size="small"
                                    type="number"
                                    min={1}

                                />
                            </Box>
                        </Box>
                    </Box> */}
                    <_TextField
                        label="Cost"
                        required
                        shrink={true}
                        type="number"
                        error={formik.touched.pricePerNight && Boolean(formik.errors.pricePerNight)}
                        helper={formik.touched.pricePerNight && formik.errors.pricePerNight}
                        value={formik.values.pricePerNight}
                        onChange={formik.handleChange}
                        name="cost"
                        disabled={true}
                    />
                    <_TextField
                        label="Total"
                        required
                        shrink={true}
                        type="number"
                        error={formik.touched.total && Boolean(formik.errors.total)}
                        helper={formik.touched.total && formik.errors.total}
                        value={formik.values.total}
                        onChange={formik.handleChange}
                        name="total"
                        disabled={true}
                    />
                    <Box sx={{ height: '2rem', marginTop: '1rem', width: 1 }}>
                        <Typography component="h4" variant="body1" textAlign="center" >{helper}</Typography>
                    </Box>
                </Box>
            </Box>
            <Button variant="contained" type='submit' sx={{ alignSelf: 'flex-end', right: '5%', top: '1rem' }} disabled={buyNow ? false : true} >Book Room</Button>
        </form >
    )
}

export default ReserveRoom