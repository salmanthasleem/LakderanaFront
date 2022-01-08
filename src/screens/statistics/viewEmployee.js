import React, { useState, useEffect } from "react";
import _TextField from "../../components/auth/textField";
import { DataGrid, } from '@mui/x-data-grid';
import { Box, TextField, Autocomplete } from "@mui/material";
import api from "../../api/api";
import BranchField from "../../components/branchField";
import { useSelector } from "react-redux";
import SearchEmployee from "../../components/auth/searchEmployee";


const columns = [
    { field: 'id', headerName: 'ID', align: "center", width: 70 },
    { field: 'branchId', headerName: 'Branch ID', type: 'number', align: "center", width: 200 },
    { field: 'firstName', headerName: 'First Name', align: "center", width: 200 },
    {
        field: 'lastName',
        headerName: 'Last Name',
        align: "center", width: 200,
    },
    {
        field: 'dob',
        headerName: 'Date Of Birth',
        type: 'date',
        align: "center", width: 200,
    },
    {
        field: 'email',
        headerName: 'Email',
        align: "center", width: 300,
    },
    {
        field: 'status',
        headerName: 'Employee Type',
        type: 'number',
        align: "center", width: 300,
    },
    {
        field: 'userName',
        headerName: 'Username',
        align: "center", width: 200,
    },
    {
        field: 'basic',
        headerName: 'Basic Salary',
        align: "center", width: 200,
    },
    {
        field: 'travel',
        headerName: 'Travel Allowance',
        align: "center", width: 200,
    },
    {
        field: 'penaltyPerLeave',
        headerName: 'Pay-Cut Per Leave',
        align: "center", width: 200,
    },
    {
        field: 'noLeavesBonus',
        headerName: 'No Leaves Bonus(Per Month)',
        align: "center", width: 200,
    },
    {
        field: 'vacayPerYear',
        headerName: 'Vacation Per Year(Days)',
        align: "center", width: 200,
    },
    {
        field: 'leavesAllowed',
        headerName: 'Leaves Allowed Per Month',
        align: "center", width: 200,
    },
    // {
    //     field: 'travel',
    //     headerName: 'Travel Allowance',
    //     sortable: false,
    //     width: 200,
    //     valueGetter: ({ row }) => {
    //         const value = row.isBooked
    //         return value == 0 ? "Open" : "Booked"
    //     }
    // },
];


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 200
};


const EmployeeDetails = () => {
    const [selected, setSelected] = useState([])
    const [employees, setEmployees] = useState([])
    const [initialEmployees, setInitialEmployees] = useState([])
    const [firstNameQuery, setfNameQuery] = useState("")
    const [lastNameQuery, setlNameQuery] = useState("")
    const [empId, setEmpId] = useState(null)
    const [isEmp, setIsEmp] = useState(false)
    const [isSearch, setIsSearch] = useState(false)
    const branch = useSelector(state => state.branch.branchId)
    const empVal = useSelector(state => state.searchEmployee.empValues)

    const getRooms = async () => {
        const user = await window.localStorage.getItem("@user")
        const data = await JSON.parse(user)
        const branchId = data.branchId
        const employeeId = data.employeeId
        setEmpId(employeeId)
        try {
            const response = await api.get('/manage/employee/searchEmployee/', {
                params: {
                    branchId: branchId
                }
            })
            const data = await response.data.data
            const isAvailable = await data.isAvailable
            if (isAvailable) {
                const rows = await data.rows
                setEmployees(rows)
                setInitialEmployees(rows)
            }
            setIsEmp(isAvailable)
        } catch (error) {
            const err = await error.response.data.data
            const isAvailable = err.isAvailable
            if (typeof isAvailable === "boolean") {
                //  setIsRoom(isAvailable)
            }
        }
    }

    const searchQuery = async (requestBody) => {
        if (requestBody) {
            try {
                const req = await api.get("/manage/employee/searchEmployee/", {
                    params: {
                        ...requestBody
                    }
                })
                const data = await req.data.data
                const isAvailable = data.isAvailable
                const rows = data.rows
                if (isAvailable) {
                    setEmployees(rows)
                    setIsEmp(true)
                } else {
                    setEmployees([])
                    setIsEmp(false)
                }
                console.log(rows)
                //setIsRoom(isRoom)
            } catch (error) {
                const isAvailable = error.response.data.data.isAvailable
                // setIsRoom(isRoom)
                if (!isAvailable) {
                    setEmployees([])
                    setIsEmp(false)
                }
            }
        }
    }

    useEffect(() => {
        if (firstNameQuery !== "" || lastNameQuery !== "") {
            setIsSearch(true)
        } else {
            setIsSearch(false)
        }

        if (!(empVal.branchId && empVal.email) && (firstNameQuery == "" && lastNameQuery == "")) {
            setEmployees(initialEmployees)
            setIsEmp(true)
        }

    }, [firstNameQuery, lastNameQuery, empVal])

    useEffect(() => {
        if (empVal.branchId && empVal.email) {
            let data = {
                firstName: empVal.empFName || "",
                lastName: empVal.empLName || "",
                dob: empVal.dob,
                empType: empVal.status,
                dob: empVal.dob,
                branchId: empVal.branchId,
            }
            searchQuery(data)
        } else if (firstNameQuery !== "" || lastNameQuery !== "") {
            let data = {
                firstName: firstNameQuery || "",
                lastName: lastNameQuery || "",
                branchId: branch,
            }
            searchQuery(data)
        }

    }, [empVal, firstNameQuery, lastNameQuery])

    useEffect(() => {
        getRooms()
    }, [])

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '1rem 2rem', width: 1 }}>
            <BranchField showBranchName={true}
                    container={{ display: 'flex', flexDirection: 'row' }}
                    sx={{ width: '15rem', margin: '1rem' }}
                />
                <_TextField
                    label="Search By First Name"
                    type='text'
                    value={firstNameQuery}
                    onChange={(e) => {
                        setfNameQuery(e.target.value)
                        setIsSearch(true)
                    }}
                    name="roomNo"
                    sx={{ width: '20rem', margin: '1rem 2rem' }}
                    disabled={branch && !Boolean(Object.values(empVal)[0])? false : true}
                    margin="none"
                />
                <_TextField
                    label="Search By Last Name"
                    type='text'
                    value={lastNameQuery}
                    onChange={(e) => {
                        setlNameQuery(e.target.value)
                        setIsSearch(true)
                    }}
                    name="roomNo"
                    sx={{ width: '20rem', margin: '1rem 2rem' }}
                    disabled={branch && !Boolean(Object.values(empVal)[0])? false : true}
                    margin="none"
                />
                {!isSearch && <SearchEmployee />}
                
            </Box>

            <div style={{ display: 'flex' }}>
                <div style={{ height: '80vh', width: '100%' }}>
                    <DataGrid
                        rows={employees}
                        columns={columns}
                        checkboxSelection
                        disableColumnFilter
                        onSelectionModelChange={(...e) => setSelected(e[0])}
                        isRowSelectable={(item) => selected.length > 1 ? false : true}
                        autoPageSize
                    />
                </div>

            </div>
        </>
    )
}

export default EmployeeDetails