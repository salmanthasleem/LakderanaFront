import React from "react";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const CustomerRegistration = ({ index, value, width }) => {

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
                justifyContent: 'space-evenly'
            }}
        >
            <_TextField
                label="Name"
                pHolder="Name"
                required
                type="text"
                error={formik.touched.name && Boolean(formik.errors.name)}
                helper={formik.touched.name && formik.errors.name}
                value={formik.values.name}
                onChange={formik.handleChange}
                name="name"
            />
            <_TextField
                label="Mobile Number"
                pHolder="947XXXXXXXX / Foreign Mobile Number"
                required
                type='number'
                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                helper={formik.touched.mobile && formik.errors.mobile}
                shrink={true}
                value={formik.values.mobile}
                onChange={formik.handleChange}
                name="mobile"
            />
            <_TextField
                label="ID/Passport No"
                pHolder="XXXXXXXXXV / XXXXXXXXXX / NXXXXXXX"
                required
                type="text"
                error={formik.touched.id && Boolean(formik.errors.id)}
                helper={formik.touched.id && formik.errors.id}
                value={formik.values.id}
                onChange={formik.handleChange}
                name="id"
            />
            <Button variant="contained" fullWidth type='submit' >Register Customer</Button>
        </form>
    )
}

export default CustomerRegistration