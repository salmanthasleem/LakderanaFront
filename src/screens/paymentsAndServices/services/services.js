import React, { useState } from "react";
import { Button, Typography, Box, Divider, Switch, FormControlLabel, Autocomplete, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import CustomerRegistration from '../../customer/customerRegistration/customerRegistration'
import SearchByCustomer from '../room/searchByCustomer'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const Services = ({ index, value }) => {
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
        >
            <Box
                sx={{
                    display: 'flex',
                    width: '100%',
                    margin: '2rem auto',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '50vh'
                }}>
                <FormControlLabel
                    control={<Switch
                        checked={newCus}
                        onChange={() => setnewCus(!newCus)}
                    />}
                    label="In-Hotel Customer"
                    labelPlacement="start"
                    sx={{ alignSelf: 'flex-start', marginLeft: '5rem', justifySelf: 'center' }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '90%' }}>
                    {newCus &&
                        <>
                            <Box sx={{ width: 1 / 3 }}>
                                <SearchByCustomer />
                            </Box>
                            <Divider orientation="vertical" flexItem variant="fullWidth" sx={{ alignContent: 'space-evenly', margin: '0 5rem' }} />
                        </>
                    }
                    <Box sx={{ width: 2 / 3, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Autocomplete
                                disablePortal
                                options={["Swimming", "Snooker", "Night Club"]}
                                renderInput={(params) => <TextField {...params} label="Services" />}
                                sx={{ width: 2 / 5 }}
                            />
                            <Autocomplete
                                disablePortal
                                options={[123, 464, 765]}
                                renderInput={(params) => <TextField {...params} label="Branch" />}
                                sx={{ width: 2 / 5 }}
                                disabled
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <_TextField
                                label="Number Of People"
                                pHolder="1"
                                required
                                type='number'
                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                helper={formik.touched.mobile && formik.errors.mobile}
                                shrink={true}
                                value={formik.values.mobile}
                                onChange={formik.handleChange}
                                name="noAdults"
                                initialValues={1}
                            />
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
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: 1, height: '5rem', alignItems: 'center' }}>
                <Button variant="contained" type='submit' sx={{ marginRight: '2rem' }}>Pay Now</Button>
                <Button variant="contained" type='submit' sx={{ marginRight: '2rem' }}>Add To Bill</Button>
            </Box>
        </form >
    )
}

export default Services