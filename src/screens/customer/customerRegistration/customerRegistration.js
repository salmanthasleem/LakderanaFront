import React, { useState } from "react";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import api from '../../../api/api'
import CustomerRegistrationFields from "../../../components/customerRegistrationFields";
import { Typography } from '@mui/material'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const CustomerRegistration = ({ index, value, width }) => {
    const [helper, setHelper] = useState("")

    const customerRegisterSchema = Yup.object({
        name: Yup.string('Enter Your Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        mobile: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
        identity: Yup.string('Enter An NIC ID Or Passport ID')
            .min(7, "Too Short")
            .required("Enter An NIC ID Or Passport ID"),
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            identity: ""
        },
        validationSchema: customerRegisterSchema,
        onSubmit: val => handleRegister(formik.values)
    })

    const handleRegister = async (values) => {
        try {
            const req = {
                name: values.name,
                mobileNo: values.mobile,
                identityId: values.identity,
                branchId: 56
            }

            const response = await api.post("/customer/register/", req)
            setHelper(response.data.message)
            formik.resetForm()
        } catch (error) {
            if (error.response.data) {
                setHelper(error.response.data.message)
            }
        }

        setTimeout(() => setHelper(""), 3000)
    }
    const helps = {
        name: formik.touched.name && formik.errors.name,
        mobile: formik.touched.mobile && formik.errors.mobile,
        identity: formik.touched.identity && formik.errors.identity,
    }

    const errs = {
        name: formik.touched.name && Boolean(formik.errors.name),
        mobile: formik.touched.mobile && Boolean(formik.errors.mobile),
        identity: formik.touched.identity && Boolean(formik.errors.identity),
    }

    const vals = {
        name: formik.values.name,
        mobile: formik.values.mobile,
        identity: formik.values.identity
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
                width: width,
                minHeight: '20rem',
                margin: '10% auto',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly'
            }}
        >
            <CustomerRegistrationFields
                helpers={helps}
                errors={errs}
                values={vals}
                onChanges={formik.handleChange}
            />
            <Typography component="h4" variant="body1">{helper}</Typography>
            <Button variant="contained" fullWidth type='submit' >Register Customer</Button>
        </form>
    )
}

export default CustomerRegistration