import React, { useState, useEffect } from "react";
import { Button, Autocomplete, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Box, Divider, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import BranchField from "../../../components/branchField";
import { useSelector } from 'react-redux'
import api from '../../../api/api'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const AddEmployee = ({ index, value, width }) => {
    const [level, setLevel] = useState('employee');
    const branchId = useSelector(state => state.branch.branchId)
    const [isBasicDetails, setIsBasicDetails] = useState(false)
    const [helper, setHelper] = useState("")
    const [isAvailable, setAvailable] = useState(false)

    const handleChange = (event) => {
        setLevel(event.target.value);
    };

    const employeeRegisterSchema = Yup.object({
        fName: Yup.string('Enter Your First Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        lName: Yup.string('Enter Your Last Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        userName: Yup.string('Enter Your User Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        dob: Yup.date('Enter Your Date Of Birth')
            .min(minDate, "Too Old")
            .max(maxDate, "Too Young")
            .required("Date Of Birth Required"),
        pass: Yup.string('Enter A Password')
            .min(7, "Too Short")
            .required("Enter A Password"),
        confirmPass: Yup.string('Enter A Same Password')
            .oneOf([Yup.ref("pass"), null], "Passwords Must Match")
            .required('Required Field & Passwords Must Match'),
        empType: Yup.string('Select One Of These Options')
            .oneOf(["Manager", "Assistant Manager", "HR Staff", "Employee"], "Invalid Value")
            .required('Select One Of These Options'),
        email: Yup.string('Enter An Email Address').email('Enter A Valid Email Address').required('Email Is Missing')
    })


    const formik = useFormik({
        initialValues: {
            fName: "",
            lName: "",
            userName: "",
            dob: "",
            pass: "",
            confirmPass: "",
            empType: "",
            email: ""
        },
        validationSchema: employeeRegisterSchema,
        onSubmit: val => handleRegister(val),
        enableReinitialize: true,
        validateOnMount: true
    })

    const searchEmployee = async () => {
        const params = {
            firstName: formik.values.fName,
            lastName: formik.values.lName,
            dob: formik.values.dob,
            email: formik.values.email,
            branchId: branchId,
            empType: formik.values.empType
        }
        let isAvailable
        try {
            const req = await api.get("/manage/employee/searchEmployee/", {
                params: params
            })
            isAvailable = await req.data.data.isAvailable
            if (typeof isAvailable === 'boolean') {
                setIsBasicDetails(isAvailable)
            }


        } catch (error) {
            console.log(error.response.data)
            isAvailable = error.response.data.data.isAvailable
            if (typeof isAvailable === 'boolean') {
                setIsBasicDetails(isAvailable)
            }
        }
        if (isAvailable) {
            setHelper("Employee Already Registered Or Details Have Been Already Taken")
        } else {
            setHelper("Employee Not Registered")
        }


    }

    useEffect(() => {
        const empType = formik.errors.empType
        const fName = formik.errors.fName
        const lName = formik.errors.lName
        const dob = formik.errors.dob
        const email = formik.errors.email
        if (!empType && !fName & !lName && !dob && !email) {
            searchEmployee()
        } else {
            setIsBasicDetails(false)
            setHelper("")
        }

    }, [formik.values])

    const handleRegister = async (val) => {
        const user = await window.localStorage.getItem("@user")
        const data = await JSON.parse(user)
        const employeeId = data.employeeId
        const body = {
            firstName: val.fName,
            lastName: val.lName,
            dob: val.dob,
            email: val.email,
            branchId: branchId,
            employeeType: val.empType,
            userName: val.userName,
            password: val.pass,
            confirmPassword: val.confirmPass,
            employeeId: employeeId
        }
        try {
            const data = await api.post("/manage/employee/register/", body)
            const response = await data.data.data
            console.log(response)
        } catch (error) {
            const data = error.response.data
            console.log(data)
        }


    }

    console.log(isBasicDetails)
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
                justifyContent: 'center',
                width: '80%'
            }}
        >
            <Box sx={{ width: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Box >
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="empType"
                            value={formik.values.empType}
                            onChange={formik.handleChange}
                            row
                            sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                            <FormControlLabel value="Employee" control={<Radio />} label="Employee" />
                            <FormControlLabel value="HR Staff" control={<Radio />} label="HR Staff" />
                            <FormControlLabel value="Assistant Manager" control={<Radio />} label="Assistant Manager" />
                            <FormControlLabel value="Manager" control={<Radio />} label="Manager" />
                        </RadioGroup>
                    </FormControl>
                    <BranchField
                        showBranchName
                        sx={{ width: 1 }}
                    />

                    <_TextField
                        label="First Name"
                        pHolder="John"
                        required
                        type='text'
                        error={formik.touched.fName && Boolean(formik.errors.fName)}
                        helper={formik.touched.fName && formik.errors.fName}

                        value={formik.values.fName}
                        onChange={formik.handleChange}
                        name="fName"

                    />
                    <_TextField
                        label="Last Name"
                        pHolder="Doe"
                        required
                        type='text'
                        error={formik.touched.lName && Boolean(formik.errors.lName)}
                        helper={formik.touched.lName && formik.errors.lName}

                        value={formik.values.lName}
                        onChange={formik.handleChange}
                        name="lName"

                    />
                    <_TextField
                        label="Date Of Birth"
                        pHolder="1995-05-05"
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
                        label="Email"
                        pHolder="XXXXX"
                        required
                        type='text'
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helper={formik.touched.email && formik.errors.email}
                        shrink={true}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        name="email"

                    />
                    <Typography sx={{ color: isBasicDetails ? 'red' : 'green' }}>{helper}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem variant="fullWidth" />
                <Box sx={{ alignSelf: 'center' }}>
                    {!isBasicDetails && <>
                        <_TextField

                            label="User Name"
                            pHolder="doe"
                            required
                            type='text'
                            error={formik.touched.userName && Boolean(formik.errors.userName)}
                            helper={formik.touched.userName && formik.errors.userName}
                            value={formik.values.userName}
                            onChange={formik.handleChange}
                            name="userName"
                            defaultValue={""}

                        /><_TextField

                            label="Password"
                            pHolder="********"
                            required
                            type='password'
                            error={formik.touched.pass && Boolean(formik.errors.pass)}
                            helper={formik.touched.pass && formik.errors.pass}

                            value={formik.values.pass}
                            onChange={formik.handleChange}
                            name="pass"
                            defaultValue={""}
                        /><_TextField

                            label="Confirm Password"
                            pHolder="********"
                            required
                            type='password'
                            error={formik.touched.confirmPass && Boolean(formik.errors.confirmPass)}
                            helper={formik.touched.confirmPass && formik.errors.confirmPass}

                            value={formik.values.confirmPass}
                            onChange={formik.handleChange}
                            name="confirmPass"

                        />
                    </>}
                </Box>
            </Box>
            <Box sx={{ width: 4 / 5, display: 'flex', margin: '2rem auto', flexDirection: 'row-reverse' }}>
                <Button variant="contained" type='submit' disabled={isBasicDetails}>Add Employee</Button>
            </Box>
        </form>
    )
}

export default AddEmployee