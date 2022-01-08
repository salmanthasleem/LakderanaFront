import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setbranchIdAsync, setcValuesAsync } from "../redux/slicers/cusAutoFill";
import { Autocomplete, TextField, Typography } from "@mui/material";
import _TextField from "./auth/textField";
import api from "../api/api";


const CustomerAutoFill = ({ errors, helpers, onchanges, identity, mobileNo }) => {
    const [isName, setIsName] = useState(false)
    const [customers, setCustomers] = useState([])
    const [initialCustomers, setInititalCustomers] = useState([])
    const [nameInput, setNameInput] = useState("")
    const [idInput, setIdInput] = useState("")
    const [cName, setCName] = useState("")
    const [cId, setCId] = useState("")
    const [mobile, setMobile] = useState("")
    const [identityId, setIdentityId] = useState("")
    const dispatch = useDispatch()
    const branch = useSelector(state => state.cusAutoFill.branchId)
    const selectedCus = useSelector(state => state.cusAutoFill.cValues)
    const cusIdentity = selectedCus.identityId
    const cusMobile = selectedCus.mobileNo



    useEffect(async () => {
        const user = await window.localStorage.getItem("@user")
        const branchId = await JSON.parse(user).branchId
        const customersObject = await api.get(`/customer/all/`, {
            params: {
                branchId: branchId
            }
        })
        const customerData = await customersObject.data.data.rows
        const combo = customerData.map(cus => ({ id: cus.id, name: cus.name, identityId: cus.identityId, mobileNo: cus.mobileNo, branchId: cus.branchId }))
        await dispatch(setbranchIdAsync(branchId))
        setCustomers(combo)
        setInititalCustomers(combo)
    }, [])

    useEffect(() => {
        if ((cName !== "" || cName !== null) && nameInput !== "") {
            const customerVals = customers.filter(element => element.name == cName)
            setNameInput(cName)
            setCustomers(customerVals)
            setIdInput("")
            setIsName(true)
        } else if (cName === "" || cName == null) {
            setCustomers(initialCustomers)
            setIdInput("")
            setCId("")
            setIsName(false)
            setCName("")
        }
    }, [cName, nameInput])

    useMemo(() => {
        const customer = customers.find(cus => cus.name === cName && cus.id === cId)
        const cVals = {
            cName: cName || "",
            cId: cId || "",
            mobileNo: mobile || customer?.mobileNo,
            identityId: identityId || customer?.identityId,
        }
        dispatch(setcValuesAsync(cVals))
        if (cName !== "" && cId !== "" && cName !== null && cId !== null) {
            if (customer) {
                setIdentityId(customer.identityId)
                setMobile(customer.mobileNo)
            }
        }
    }, [cName, cId, mobile, identityId])

    return (
        <>
            <Autocomplete
                name="name"
                value={cName}
                onChange={(event, newValue) => {
                    setCName(newValue)
                    onchanges.name()
                }}
                inputValue={nameInput}
                onInputChange={(event, newInputValue) => {
                    setNameInput(newInputValue)
                    setCId("")
                    setIdentityId("")
                    setMobile("")
                }}
                options={customers.map(customer => customer.name)}
                renderInput={(params) => <TextField {...params} label="Enter Customer Name" type="text" />}
                autoSelect
                clearOnBlur
                sx={{ width: 1, margin: '1rem 0 ' }}
            />
            {errors.name && <Typography component="p" textAlign="center" variant="p" color="red">
                {helpers.name}
            </Typography>}
            {isName && <Autocomplete
                name="id"
                value={cId}
                onChange={(event, newValue) => {
                    setCId(newValue)
                    onchanges.id()
                }}
                inputValue={idInput}
                onInputChange={(event, newInputValue) => {
                    setIdInput(newInputValue)
                    setIdentityId("")
                    setMobile("")
                }}
                options={customers.map(customer => customer.id)}
                renderInput={(params) => <TextField {...params} label="Enter Customer ID" type="number" />}
                autoSelect
                clearOnBlur
                sx={{ width: 1, margin: '1rem 0 ' }}
            />
            }
            {errors.id && <Typography component="p" textAlign="center" variant="p" color="red">
                {helpers.id}
            </Typography>}
            {identity && <Autocomplete
                name="identity"
                value={cusIdentity}
                options={[cusIdentity]}
                renderInput={(params) => <TextField {...params} label="Identity ID" type="text" />}
                disableClearable
                defaultValue={cusIdentity}
                clearOnBlur
                sx={{ width: 1, margin: '1rem 0 ' }}
            />}

            {mobileNo && <Autocomplete
                name="mobile"
                value={cusMobile}
                options={[cusMobile]}
                renderInput={(params) => <TextField {...params} label="Mobile No" type="number" />}
                disableClearable
                defaultValue={cusMobile}
                clearOnBlur
                sx={{ width: 1, margin: '1rem 0 ' }}
            />}
            <_TextField
                label="Branch Id"
                disabled={true}
                type="text"
                value={branch}
                name="branch"
                shrink={true}
            />
        </>
    )
}

export default CustomerAutoFill