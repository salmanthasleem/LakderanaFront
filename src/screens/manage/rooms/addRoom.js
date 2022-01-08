import React, { useState, useEffect } from "react";
import { Button, Autocomplete, TextField, Box, Divider, Checkbox, FormControlLabel, Radio, RadioGroup, FormLabel, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import api from '../../../api/api'
import BranchField from '../../../components/branchField'
import { useSelector } from 'react-redux'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const AddRoom = ({ index, value, width }) => {
    const [type, setType] = useState("")
    const [otherValue, setOtherValue] = useState("")
    const branchId = useSelector(state => state.branch.branchId)
    const [isRoomType, setRoomType] = useState(false)
    const [helperText, setHelperText] = useState("")
    const [isWarning, setWarning] = useState(false)



    const addRoomSchema = Yup.object({
        branch: Yup.string('Select A Branch Id')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        roomNo: Yup.number('Enter A Room Number')
            .max(1000, "Room Number Seems Too Long")
            .required("Room Number Is Required"),
        roomType: Yup.string('Select Or Specify A Room Type')
            .min(4, "Too Short")
            .required("Room Type Is Required"),
        minAdults: Yup.number('Enter A Number').min(1, "Enter A Valid Number").max(5, "Enter A Realistic Number").default(1),
        minChildren: Yup.number('Enter A Number').min(0, "Enter A Valid Number").max(5, "Enter A Realistic Number").default(0),
        beds: Yup.number('Enter A Number').min(1, "Enter A Valid Number").max(3, "Enter A Realistic Number").default(1),
        price: Yup.number('Enter A Number').min(0, 'Enter A Value'),

    })

    const formik = useFormik({
        initialValues: {
            branch: "",
            roomNo: "",
            roomType: "",
            minAdults: 1,
            minChildren: 0,
            price: "",
            beds: ""
        },
        validationSchema: addRoomSchema,
        onSubmit: val => handleSubmit(val)
    })

    useEffect(() => {
        formik.setFieldValue('branch', branchId)
    }, [branchId])

    const checkRoomType = async () => {
        const branch = formik.values.branch
        const roomType = formik.values.roomType
        const minAdults = formik.values.minAdults
        const minChildren = formik.values.minChildren
        const price = formik.values.price
        const beds = formik.values.beds
        if (branch && roomType && minAdults && minChildren && beds) {
            const vals = {
                branch: branch,
                roomType: roomType,
                minAdults: minAdults,
                minChildren: minChildren,
                price: price,
                beds: beds
            }
            console.log(vals)
            try {
                const response = await api.get("/manage/room/get/", {
                    params: vals
                })
                const isType = await response.data.data.isRoomType
                if (isType) {
                    setWarning(false)
                    setHelperText("Room Type Is Available")
                }
                setRoomType(true)

            } catch (error) {
                const err = error.response.data.data
                const isType = err.isRoomType

                if (!isType) {
                    setWarning(true)
                    setHelperText("Room Type Is Not Available\nNew Room Type Will Be Created")
                }
                setRoomType(true)
                console.log(isType)
                //console.log(response)
            }
        } else {
            setRoomType(false)
        }
    }

    useEffect(() => {
        checkRoomType()
    }, [formik.values.price, formik.values.branch, formik.values.roomType, formik.values.minAdults, formik.values.minChildren, formik.values.rooms])

    useEffect(() => {
        if (!isRoomType) {
            formik.setFieldValue('roomNo', "")
        }
    }, [isRoomType])

    const handleOtherRoomType = (e) => {
        formik.setFieldValue('roomType', e.target.value)
    }

    const handleRoomType = (e) => {
        const value = e.target.value
        setType(e.target.value)
        if (value !== "other") {
            formik.setFieldValue('roomType', e.target.value)
        } else {
            formik.setFieldValue('roomType', "")
        }
    }

    const handleSubmit = async (val) => {
        try {
            // console.log(val)
            const response = await api.post('/manage/room/create/', val)
            if (response.data.status == 1) {
                const message = response.data.message
                setHelperText("Room Creation Success")
                setTimeout(() => setHelperText(message), 1000)
                setTimeout(() => setHelperText(""), 2000)
                setWarning(false)
                console.log(formik.values)
            }
            console.log(response.data.status)
            // console.log(val)

        } catch (error) {
            const message = error.response.data.message
            setHelperText("Room Creation Failed")
            setWarning(true)
            setTimeout(() => setHelperText(message), 1000)
            setTimeout(() => setHelperText(""), 2000)
            console.log(error.response.data.status)
        }
        //const response = await api.get('/manage/room/get/', val)
        // const data = await response.data
    }



    if (index !== value) return null
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
            }}
            style={{
                display: 'flex',
                minHeight: '20rem',
                margin: '10% auto',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%'
            }}
        >
            <Box sx={{ display: "flex", flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                <Box sx={{ width: '50%' }}>
                    <Box sx={{ margin: '1rem', width: 1, display: 'flex', justifyContent: 'space-evenly' }}>
                        <FormLabel component="div" sx={{ width: 1, margin: '1rem' }}>Room Type
                            <RadioGroup
                                aria-label="gender"
                                name="roomType"
                                value={type}
                                onChange={handleRoomType}
                                row
                                sx={{ width: 1, margin: '1rem 0' }}
                            >
                                <FormControlLabel value="normal" sx={{ margin: "0 2rem" }} control={<Radio />} label="Normal" />
                                <FormControlLabel value="deluxe" sx={{ margin: "0 2rem" }} control={<Radio />} label="Deluxe" />
                                <FormControlLabel value="other" sx={{ margin: "0 2rem" }} control={<Radio />} label="Other" />
                                {type === "other" && <_TextField
                                    label="Type"
                                    pHolder="normal"
                                    required
                                    type='text'
                                    shrink={true}
                                    value={formik.values.roomType}
                                    onChange={handleOtherRoomType}
                                    name="otherRoom"

                                />}

                            </RadioGroup>
                            {
                                formik.touched.roomType && Boolean(formik.errors.roomType) &&
                                <Typography component="p" variant="caption" sx={{ color: 'red' }}>{formik.touched.roomType && formik.errors.roomType}</Typography>
                            }
                        </FormLabel>
                    </Box>
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

                    />
                    <_TextField
                        label="Minimum Number Of Adults"
                        pHolder="1"
                        required
                        type='number'
                        error={formik.touched.minAdults && Boolean(formik.errors.minAdults)}
                        helper={formik.touched.minAdults && formik.errors.minAdults}
                        shrink={true}
                        value={formik.values.minAdults}
                        onChange={formik.handleChange}
                        name="minAdults"

                    />
                    <_TextField
                        label="Minimum Number Of Childrens"
                        pHolder="0"
                        required
                        type="number"
                        error={formik.touched.minChildren && Boolean(formik.errors.minChildren)}
                        helper={formik.touched.minChildren && formik.errors.minChildren}
                        value={formik.values.minChildren}
                        onChange={formik.handleChange}
                        name="minChildren"

                    />
                    <_TextField
                        label="Price"
                        pHolder="0"
                        required
                        type="number"
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helper={formik.touched.price && formik.errors.price}
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        name="price"

                    />
                </Box>
                <Divider flexItem variant="fullWidth" orientation="vertical" />
                <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', minHeight: '20rem', justifyContent: 'center' }}>
                    <BranchField
                        errors={formik.touched.branch && Boolean(formik.errors.branch)}
                        helpers={formik.touched.branch && formik.errors.branch}
                    />
                    {isRoomType && <_TextField
                        label="Room Number"
                        pHolder="XXXXX"
                        required
                        type='number'
                        error={formik.touched.roomNo && Boolean(formik.errors.roomNo)}
                        helper={formik.touched.roomNo && formik.errors.roomNo}
                        shrink={true}
                        value={formik.values.roomNo}
                        onChange={formik.handleChange}
                        name="roomNo"

                    />}
                </Box>
            </Box>

            <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center', margin: '5rem 0' }} >
                <Typography sx={{ color: !isWarning ? `green` : `red` }}>{helperText}</Typography>
                <Button variant="contained" type='submit' sx={{ width: 2 / 5, margin: '2rem 0', transform: 'translateX(0%)', bottom: '0' }}>Add Room</Button>
            </Box>
        </form >
    )
}

export default AddRoom