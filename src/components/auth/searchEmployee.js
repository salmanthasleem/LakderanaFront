import React, { useState, useEffect } from "react";
import BranchField from '../branchField'
import { Box, Autocomplete, TextField } from '@mui/material'
import { useSelector, useDispatch } from "react-redux";
import api from "../../api/api";
import { setEmpValuesAsync } from "../../redux/slicers/employeeslice";

const SearchEmployee = ({ sx }) => {
    const branchId = useSelector(state => state.branch.branchId)
    const [employees, setEmployees] = useState([])
    const [empName, setName] = useState("")
    const [empEmail, setEmail] = useState("")
    const [filteredEmps, setFilteredEmps] = useState([])
    const dispatch = useDispatch()
    const empVal = useSelector(state => state.searchEmployee.empValues)

    const getEmployees = async () => {
        try {
            const response = await api.get("/manage/employee/searchEmployee", {
                params: {
                    branchId: branchId
                }
            })
            const data = await response.data.data
            const rows = await data.rows
            if (data.isAvailable) {

                const empValues = rows.map(row => ({
                    empFName: row.firstName, empLName: row.lastName, empFullName: `${row.firstName}-${row.lastName}`,
                    email: row.email, status: row.status, branchId: branchId,
                    empId: row.id,
                    dob: new Date(row.dob).toLocaleDateString()
                }))

                setEmployees(empValues)
            } else {
                setEmployees([])
            }
        } catch (error) {
            const isAvailable = error.response.data.data.isAvailable
            if (!isAvailable) {
                setEmployees([])
            }
        }
    }
    const handleEmployeeSubmission = () => {
        if (empEmail && empName) {
            const Dob = new Date(filteredEmps[0].dob)
            const employee = {
                empFName: filteredEmps[0].empFName,
                empLName: filteredEmps[0].empLName,
                email: filteredEmps[0].email,
                status: filteredEmps[0].status,
                dob: Dob,
                branchId: filteredEmps[0].branchId,
                empId: filteredEmps[0].empId
            }
            dispatch(setEmpValuesAsync(employee))
        }
    }
    useEffect(() => {
        handleEmployeeSubmission()
    }, [empEmail, empName])

    const handleEmpNameChange = (e, val) => {
        if (val) {
            setName(val)
            const filter = employees.filter(employee => employee.empFullName === val)
            setFilteredEmps(filter)
            setEmail("")
            dispatch(setEmpValuesAsync())
        }
    }

    const handleEmailChange = (e, val) => {
        if (val && filteredEmps) {
            console.log(val)
            setEmail(val)
            const doubleFilter = filteredEmps.filter(emp => emp.email === val)
            setFilteredEmps(doubleFilter)
        }
    }

    useEffect(() => {
        getEmployees()
        dispatch(setEmpValuesAsync())
        if (!branchId) {
            setEmail("")
            setName("")
        }
    }, [branchId])

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 1, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Autocomplete
                    disablePortal
                    options={employees.map(employee => employee.empFullName)}
                    renderInput={(params) => <TextField {...params} label="Employee Name" />}
                    name="Employee Name"
                    onChange={handleEmpNameChange}
                    value={empName}
                    onInputChange={() => {
                        setName("")
                        setEmail("")
                        dispatch(setEmpValuesAsync())
                    }}
                    disabled={branchId ? false : true}
                    sx={{ width: '20rem', margin: 'auto 1rem' }}
                />
                <Autocomplete
                    disablePortal
                    options={filteredEmps.map(employee => employee.email)}
                    renderInput={(params) => <TextField {...params} label="Employee Email" />}
                    name="Employee Email"
                    onChange={handleEmailChange}
                    value={empEmail}
                    onInputChange={() => {
                        setEmail("")
                        dispatch(setEmpValuesAsync())
                    }}
                    disabled={empName ? false : true}
                    sx={{ width: '25rem', margin: 'auto 1rem' }}
                />

                <TextField label="Employee Status" value={empEmail && empName ? filteredEmps[0].status : ""} disabled sx={{ width: '10rem', margin: 'auto 1rem' }} />
                <TextField label="Employee Date Of Birth" value={empEmail && empName ? filteredEmps[0].dob : ""} disabled sx={{ width: '15rem', margin: 'auto 1rem' }} />
            </Box>
        </Box>
    )
}


export default SearchEmployee