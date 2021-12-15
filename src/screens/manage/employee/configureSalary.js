import React, { useState } from "react";
import { Button, Typography, Box, Divider, Switch, FormControlLabel, Autocomplete, TextField, RadioGroup, FormLabel, FormControl, Radio } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const ConfigureSalary = ({ index, value }) => {
    const [food, setFood] = useState({
        breakfast: false,
        lunch: false,
        dinner: false
    });
    const [level, setLevel] = useState('employee');

    const handleChange = (event) => {
        setLevel(event.target.value);
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
                <Typography variant="h4" component="h3" >Customer Details</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '90%' }}>
                <Box sx={{ width: 2 / 3, display: 'flex', flexDirection: 'column' }}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="controlled-radio-buttons-group"
                            value={level}
                            onChange={handleChange}
                            row
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <FormControlLabel value="employee" control={<Radio />} label="Employee" />
                            <FormControlLabel value="hrStaff" control={<Radio />} label="HR Staff" />
                            <FormControlLabel value="assistantManager" control={<Radio />} label="Assistant Manager" />
                            <FormControlLabel value="manager" control={<Radio />} label="Manager" />
                        </RadioGroup>
                    </FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} >
                        <_TextField
                            label="Leaves Without Pay-Cut(Per Month)"
                            pHolder="1"
                            required
                            type='number'
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helper={formik.touched.mobile && formik.errors.mobile}
                            shrink={true}
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            name="leavesw/o"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                        />
                        <_TextField
                            label="Pay-Cut Deduction Per Leave"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.id && Boolean(formik.errors.id)}
                            helper={formik.touched.id && formik.errors.id}
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            name="payCut"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                        />
                        <_TextField
                            label="Vacation Per Year"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.id && Boolean(formik.errors.id)}
                            helper={formik.touched.id && formik.errors.id}
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            name="vacayear"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                        />
                        <_TextField
                            label="Base Salary"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.id && Boolean(formik.errors.id)}
                            helper={formik.touched.id && formik.errors.id}
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            name="payCut"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                        />
                        <_TextField
                            label="No Leaves Bonus Per Month"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.id && Boolean(formik.errors.id)}
                            helper={formik.touched.id && formik.errors.id}
                            value={formik.values.id}
                            onChange={formik.handleChange}
                            name="noLeaves"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                        />
                    </Box>
                </Box>
            </Box>
            <Button variant="contained" type='submit' sx={{ alignSelf: 'center', right: '5%', top: '1rem' }}>Save Settings</Button>
        </form >
    )
}

export default ConfigureSalary