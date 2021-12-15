import React, { useState } from "react";
import { Button, Typography, Box, Divider, Switch, FormControlLabel, Autocomplete, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import CustomerRegistration from '../../customer/customerRegistration/customerRegistration'
import SearchByCustomer from './searchByCustomer'

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

    const handleFood = (breakfast = food.breakfast, lunch = food.lunch, dinner = food.dinner) => {
        setFood({ breakfast, lunch, dinner })
    }

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
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            id: ""
        },
        validationSchema: customerRegisterSchema,
        onSubmit: val => console.log(val)
    })

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
                    <_TextField
                        id="date"
                        label="Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        name="date"
                        shrink={true}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Autocomplete
                            disablePortal
                            options={["Normal", "Luxury"]}
                            renderInput={(params) => <TextField {...params} label="Room Type" />}
                            sx={{ width: 2 / 5 }}

                        />
                        <Autocomplete
                            disablePortal
                            options={[123, 464, 765]}
                            renderInput={(params) => <TextField {...params} label="Room Number" />}
                            sx={{ width: 2 / 5 }}
                        />
                    </Box>
                    <Autocomplete
                        disablePortal
                        options={[123, 464, 765]}
                        renderInput={(params) => <TextField {...params} label="Branch" />}
                        sx={{ width: 1, margin: '1rem 0' }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <_TextField
                            label="Number Of Adults"
                            pHolder="1"
                            required
                            type='number'
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helper={formik.touched.mobile && formik.errors.mobile}
                            shrink={true}
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            name="noAdults"
                            sx={{ width: 2 / 5 }}
                        />
                        <_TextField
                            label="Number Of Childrens"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.id && Boolean(formik.errors.id)}
                            helper={formik.touched.id && formik.errors.id}
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            name="noChilds"
                            sx={{ width: 2 / 5 }}
                        />
                    </Box>
                    <_TextField
                        label="Length Of Stay(Nights)"
                        pHolder="1"
                        required
                        type="number"
                        error={formik.touched.id && Boolean(formik.errors.id)}
                        helper={formik.touched.id && formik.errors.id}
                        value={formik.values.id}
                        onChange={formik.handleChange}
                        name="nights"
                    />
                    <Box>
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
                    </Box>
                    <_TextField
                        label="Cost"
                        required
                        shrink={true}
                        type="number"
                        error={formik.touched.id && Boolean(formik.errors.id)}
                        helper={formik.touched.id && formik.errors.id}
                        value={formik.values.id}
                        onChange={formik.handleChange}
                        name="cost"
                        disabled
                    />
                </Box>
            </Box>
            <Button variant="contained" type='submit' sx={{ alignSelf: 'flex-end', right: '5%', top: '1rem' }}>Book Room</Button>
        </form >
    )
}

export default ReserveRoom