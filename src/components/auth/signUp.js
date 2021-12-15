import React from "react";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup'
import _TextField from './textField'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const SignUp = ({ index, value, navigate }) => {

    const signUpSchema = Yup.object({
        name: Yup.string('Enter Your Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        dob: Yup.date('Enter Your Date Of Birth')
            .min(minDate, "Too Old")
            .max(maxDate, "Too Young")
            .required("Date Of Birth Required"),
        password: Yup.string('Enter A Password')
            .min(7, "Too Short")
            .required("Enter A Password"),
        confirmPass: Yup.string('Enter A Same Password')
            .oneOf([Yup.ref("password"), null], "Passwords Must Match")
            .required('Required Field & Passwords Must Match')
    })

    const formik = useFormik({
        initialValues: {
            name: "",
            dob: "",
            password: "",
            confirmPass: ""
        },
        validationSchema: signUpSchema,
        onSubmit: val => navigate("/protected")
    })

    if (index !== value) return null
    return (
        <form
            onSubmit={formik.handleSubmit}
            style={{
                display: 'flex',
                width: '40%',
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
                label="DOB"
                pHolder="DOB"
                required
                type='date'
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helper={formik.touched.dob && formik.errors.dob}
                shrink={true}
                value={formik.values.dob}
                onChange={formik.handleChange}
                name="dob"
            />
            <_TextField
                label="Password"
                pHolder="Password"
                required
                type="password"
                error={formik.touched.password && Boolean(formik.errors.password)}
                helper={formik.touched.password && formik.errors.password}
                value={formik.values.password}
                onChange={formik.handleChange}
                name="password"
            />
            <_TextField
                label="Confirm Password"
                pHolder="Confirm Password"
                required
                type="password"
                error={formik.touched.confirmPass && Boolean(formik.errors.confirmPass)}
                helper={formik.touched.confirmPass && formik.errors.confirmPass}
                value={formik.values.confirmPass}
                onChange={formik.handleChange}
                name="confirmPass"
            />
            <Button variant="contained" fullWidth type='submit' >Login</Button>
        </form>
    )
}

export default SignUp