import React, { useEffect, useState } from "react";
import { Button, Autocomplete, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import { useSelector } from 'react-redux'
import Location from '../../../components/glLocation'
import api from '../../../api/api'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const AddBranch = ({ index, value, width }) => {
    const query = useSelector(state => state.gLocation.query)
    const [helper, setHelper] = useState("")

    const barRegisterSchema = Yup.object({
        branchName: Yup.string('Enter Branch Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        location: Yup.string('Enter Branch Location').required('Required'),
        empId: Yup.string('Enter An NIC ID Or Passport ID')
            .min(1, "Too Short")
            .required("Enter An NIC ID Or Passport ID"),
    })

    const formik = useFormik({
        initialValues: {
            branchName: "",
            location: "",
            empId: ""
        },
        validationSchema: barRegisterSchema,
        onSubmit: val => handleSubmit(val)
    })

    useEffect(() => {
        const user = window.localStorage.getItem("@user")
        const parsed = JSON.parse(user)
        const empId = parsed.employeeId
        formik.setFieldValue('empId', empId)
    }, [])

    useEffect(() => {
        formik.setFieldValue('location', query)
    }, [query])

    const handleSubmit = async (val) => {
        if (formik.values.empId) {
            try {
                const response = await api.post("/branch/create/", val)
                const data = await response.data
                const message = await data.message
                const isSuccess = data.data.isSuccess
                setHelper(message)
            } catch (error) {
                const response = error.response.data
                const message = response.message
                setHelper(message)
            }
        }
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
                justifyContent: 'space-evenly',
                width: '80%'
            }}
        >
            <_TextField
                label="Branch Name"
                pHolder="XXXXX"
                required
                type='text'
                error={formik.touched.branchName && Boolean(formik.errors.branchName)}
                helper={formik.touched.branchName && formik.errors.branchName}
                shrink={true}
                value={formik.values.branchName}
                onChange={formik.handleChange}
                name="branchName"
                sx={{ width: 3 / 5 }}
            />
            <Location
                errors={formik.touched.location && Boolean(formik.errors.location)}
                helpers={formik.touched.location && formik.errors.location}
                sx={{ width: 3 / 5 }}
            />
            <Typography component="h4" variant="body1" >{helper} </Typography>
            <Button variant="contained" type='submit' >Add Branch</Button>
        </form>
    )
}

export default AddBranch