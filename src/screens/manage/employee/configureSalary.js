import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Divider, Switch, FormControlLabel, Autocomplete, TextField, RadioGroup, FormLabel, FormControl, Radio } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import BranchField from '../../../components/branchField'
import SearchEmployee from '../../../components/auth/searchEmployee'
import { useSelector } from 'react-redux'
import api from '../../../api/api'

let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const ConfigureSalary = ({ index, value }) => {
    const employee = useSelector(state => state.searchEmployee.empValues)
    const empEmail = employee.email
    const empBranchId = employee.branchId
    const [isAvailable, setIsAvailable] = useState(false)
    const [helper, setHelper] = useState("")
    const [isEmpDetailsChanged, setEmpDetailsChanged] = useState(false)
    const [employeeDetails, setEmployeeDetails] = useState(null)
    const empId = employee.empId

    useEffect(() => {
        if (empEmail && empBranchId) {
            searchEmployee()
        } else {
            setHelper("")
        }

    }, [empEmail, empBranchId])

    const employeeSalarySchema = Yup.object({
        empId: Yup.number('Specify A Valid Employee Id')
            .min(1, 'Invalid Id')
            .max(1000000, 'Too Long!')
            .required('Specify An Employee Id'),
        branchId: Yup.number('Specify A Branch Id')
            .min(1, "Enter A Valid Branch Id")
            .max(1000000, "Too Long")
            .required("Branch Id Required"),
        basic: Yup.number('Enter Salary For This Employee')
            .min(15000, "Too Low For A Salary")
            .required("Can't Work Without A Pay Day!"),
        travel: Yup.number('Enter Travel Allowance For This Employee')
            .min(10000, "Fuel Expenses Are High These Days")
            .default(0)
            .optional(),
        penaltyPerLeave: Yup.number('Enter A value')
            .min(0, "Enter A Valid Value")
            .max(10000, "Too High For A Leave, Please Go Easy On This Employee")
            .default(0),
        noLeavesBonus: Yup.number('Enter A value')
            .min(0, "Enter A Valid Value")
            .max(100000, "Employee's Going To Love It,But Dont Go Higher Than This")
            .default(10000),
        vacayPerYear: Yup.number('Enter A Valid Value')
            .min(7, "Everybody Want's A Break")
            .max(50, "That's Too Long For A Vacation")
            .required("Everybody Would Want To Have A Break"),
        leavesAllowed: Yup.number('Enter The Number Of Leaves Allowed Per Month')
            .min(3, "Invalid Or Too Low")
            .max(7, "That's Too Much, Keep It Less Than A Week")
            .required("Emergency Leaves Are Necessary"),
    })

    const formik = useFormik({
        initialValues: {
            "empId": "",
            "branchId": "",
            "basic": 20000,
            "travel": 10000,
            "penaltyPerLeave": 1000,
            "noLeavesBonus": 5000,
            "vacayPerYear": 10,
            "leavesAllowed": 5,
        },
        validationSchema: employeeSalarySchema,
        onSubmit: val => handleSubmit(val)
    })

    useEffect(() => {
        formik.setFieldValue('empId', empId)
        formik.setFieldValue('branchId', empBranchId)
    }, [empBranchId, empId])

    useEffect(() => {
        if (employeeDetails) {
            const employeeInitialValues = Object.values(employeeDetails)
            const employeeFinalValues = Object.values(formik.values)
            const isChanged = !employeeFinalValues.every(item => Object.values(employeeInitialValues).includes(item))
            console.log(isChanged)
            if (isChanged) {
                setEmpDetailsChanged(true)
            } else {
                setEmpDetailsChanged(false)
            }
        }

    }, [formik.values, employeeDetails])

    const searchEmployee = async () => {
        let isAvailable
        try {
            const response = await api.get("/hr/salary/search/", {
                params: {
                    email: empEmail,
                    branchId: empBranchId
                }
            })
            const data = await response.data.data
            if (data) {
                isAvailable = data.isAvailable
                setIsAvailable(isAvailable)
                if (data.rows) {
                    formik.setValues(data.rows[0])
                    setEmployeeDetails(data.rows[0])
                }
                console.log(data.rows)
            }
        } catch (error) {
            const res = await error.response.data.data
            if (res) {
                isAvailable = res.isAvailable
                setIsAvailable(isAvailable)
            }
        }
        if (isAvailable) {
            setHelper("Employee Salary Details Available")
        }
        else {
            setHelper("Employee Salary Details Not Available\nConfigure Salary Details For This Employee")
        }
    }

    const handleSubmit = async (val) => {
        try {
            const response = await api.put("/hr/salary/addSalary/", val)
            const data = await response.data.data
            console.log("success")
            console.log(data)
        } catch (error) {
            const data = await error.response.data.data
            console.log("error")
            console.log(data)
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
                width: '100%',
                margin: '2rem auto',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60rem'
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', margin: '2rem auto', width: '100%', }}>
                <Typography variant="h4" component="h3" >Customer Details</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '90%' }}>
                <Box sx={{ width: 2 / 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} >
                    <BranchField showBranchName={true}
                    container={{ display: 'flex', flexDirection: 'row' }}
                    sx={{ width: 1, margin: '1rem' }}
                />
                        <SearchEmployee />
                        <_TextField
                            label="Leaves Without Pay-Cut(Per Month)"
                            pHolder="1"
                            required
                            type='number'
                            error={formik.touched.leavesAllowed && Boolean(formik.errors.leavesAllowed)}
                            helper={formik.touched.leavesAllowed && formik.errors.leavesAllowed}
                            shrink={true}
                            value={formik.values.leavesAllowed}
                            onChange={formik.handleChange}
                            name="leavesAllowed"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                            defaultValue={0}
                        />
                        <_TextField
                            label="Pay-Cut Deduction Per Leave"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.penaltyPerLeave && Boolean(formik.errors.penaltyPerLeave)}
                            helper={formik.touched.penaltyPerLeave && formik.errors.penaltyPerLeave}
                            value={formik.values.penaltyPerLeave}
                            onChange={formik.handleChange}
                            name="penaltyPerLeave"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                            defaultValue={1000}
                        />
                        <_TextField
                            label="Vacation Per Year(days)"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.vacayPerYear && Boolean(formik.errors.vacayPerYear)}
                            helper={formik.touched.vacayPerYear && formik.errors.vacayPerYear}
                            value={formik.values.vacayPerYear}
                            onChange={formik.handleChange}
                            name="vacayPerYear"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                            defaultValue={10}
                        />
                        <_TextField
                            label="Base Salary"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.basic && Boolean(formik.errors.basic)}
                            helper={formik.touched.basic && formik.errors.basic}
                            value={formik.values.basic}
                            onChange={formik.handleChange}
                            name="basic"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                            defaultValue={20000}
                        />
                        <_TextField
                            label="No Leaves Bonus Per Month"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.noLeavesBonus && Boolean(formik.errors.noLeavesBonus)}
                            helper={formik.touched.noLeavesBonus && formik.errors.noLeavesBonus}
                            value={formik.values.noLeavesBonus}
                            onChange={formik.handleChange}
                            name="noLeavesBonus"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                            defaultValue={5000}
                        />
                        <_TextField
                            label="Travel Allowance"
                            pHolder="0"
                            required
                            type="number"
                            error={formik.touched.travel && Boolean(formik.errors.travel)}
                            helper={formik.touched.travel && formik.errors.travel}
                            value={formik.values.travel}
                            onChange={formik.handleChange}
                            name="travel"
                            sx={{ width: 2 / 5, margin: "1rem" }}
                            defaultValue={10000}
                        />
                        <Typography sx={{ color: !isAvailable ? 'red' : 'green' }} component="p" variant="subtitle1" >
                            {helper}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box>
                <Button variant="contained" disabled={isAvailable ? true : !isAvailable && empEmail && empBranchId ? false : true} type='submit' sx={{ alignSelf: 'center', top: '1rem', margin: '1rem' }}> Add Salary Details</Button>
                <Button variant="contained" disabled={empEmail && empBranchId && isEmpDetailsChanged && isAvailable ? false : true} type='submit' sx={{ alignSelf: 'center', top: '1rem', margin: '1rem' }}>{"Save Settings"}</Button>
            </Box>

        </form >
    )
}

export default ConfigureSalary