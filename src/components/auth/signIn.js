import React from "react";
import { Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup'
import _TextField from './textField'
import useAuth from "../../hooks/useAuth";

const SignIn = ({ index, value, navigate }) => {
    const auth = useAuth()

    const loginSchema = Yup.object({
        username: Yup.string('Enter A Username')
            .min(5, 'Username Too Short')
            .max(30, 'Username Too Long')
            .required('Enter A Username'),
        password: Yup.string('Enter A Password')
            .required('Enter A Password')
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: val => handleLogin(formik.values)
    })

    const handleLogin = (values) => {
        const req = { userName: values.username, password: values.password }
        auth.signIn(req)
    }

    if (index !== value) return null
    return (
        <form
            style={{
                display: 'flex',
                width: '40%',
                minHeight: '20rem',
                margin: '10% auto',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-evenly'
            }}
            onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
            }}
        >
            <_TextField
                label="Username"
                pHolder="Username"
                required
                type="text"
                error={formik.touched.username && Boolean(formik.errors.username)}
                helper={formik.touched.username && formik.errors.username}
                value={formik.values.username}
                onChange={formik.handleChange}
                name="username"
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
            <Button variant="contained" fullWidth type='submit'>Login</Button>
        </form>
    )
}

export default SignIn