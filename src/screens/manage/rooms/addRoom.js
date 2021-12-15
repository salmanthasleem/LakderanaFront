import React from "react";
import { Button, Autocomplete, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const AddRoom = ({ index, value, width }) => {

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
                width: width,
                minHeight: '20rem',
                margin: '10% auto',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                width: '80%'
            }}
        >
            <Autocomplete
                disablePortal
                options={["Branch 1", "Branch 2"]}
                renderInput={(params) => <TextField {...params} label="Branch" />}

                sx={{ width: 3 / 5 }}

            />
            <Autocomplete
                disablePortal
                options={["Branch 1", "Branch 2"]}
                renderInput={(params) => <TextField {...params} label="Room Type" />}

                sx={{ width: 3 / 5 }}

            />
            <_TextField
                label="Room Number"
                pHolder="XXXXX"
                required
                type='number'
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helper={formik.touched.mobile && formik.errors.mobile}
                shrink={true}
                value={formik.values.mobile}
                onChange={formik.handleChange}
                name="mobile"
                sx={{ width: 3 / 5 }}
            />
            <Button variant="contained" type='submit' >Add Room</Button>
        </form>
    )
}

export default AddRoom