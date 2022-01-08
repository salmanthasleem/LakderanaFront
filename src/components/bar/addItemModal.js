import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Fade, Modal, Backdrop, Autocomplete, TextField } from "@mui/material";
import { Formik, useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../auth/textField'
import { useSelector, useDispatch } from "react-redux";
import { setModalOpen } from '../../redux/slicers/addItemModalSlice'
import api from "../../api/api";
import BranchField from '../branchField'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '1rem',
    boxShadow: 24,
    p: 4,
};


const BarAddItem = ({ index, value, width }) => {
    const dispatch = useDispatch()
    const branchId = useSelector(state => state.branch.branchId)
    const open = useSelector(state => state.barItem.modalOpen)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [helper, setHelper] = useState("")

    const addBarItemSchema = Yup.object({
        name: Yup.string('Enter Beverage Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        type: Yup.string('Enter Beverage Type')
            .oneOf(["Alcohol", "Soda", "Other"], "Invalid Type")
            .min(1, "Too Short")
            .required("Enter A Beverage Type"),
        quantity: Yup.number('Specify quantity').min(0.25, "It's too low").required('Required Value'),
        price: Yup.number('Specify Price').min(50, "It's too low").required('Required Value'),
        cost: Yup.number('Specify Cost').min(50, "It's too low").required('Required Value'),
        stock: Yup.number('Specify The Number Of Units').required('Required Value'),
        branchId: Yup.number("Specify Branch Id").required('Required Value')
    })
    const formik = useFormik({
        initialValues: {
            name: "",
            type: "",
            quantity: "",
            price: "",
            stock: "",
            branchId: "",
            cost: ""
        },
        validationSchema: addBarItemSchema,
        onSubmit: val => handleItemAddition(formik.values)
    })

    useEffect(() => {
        formik.setFieldValue('branchId', branchId)
    }, [branchId])

    const handleClose = () => {
        dispatch(setModalOpen(false))
        formik.resetForm()
    };

    const searchDrinks = async (values) => {
        try {
            setSubmitLoading(true)
            const response = await api.get("/bar/getStock/", {
                params: values
            })
            const isAvailable = await response.data.data.isAvailable
            setSubmitLoading(false)
            if (isAvailable) {
                setHelper("Beverage Type Available, Continue Adding Item")
            } else {
                setHelper("Beverage Type Not Available, New Type Will Be Added")
            }
        } catch (error) {
            setHelper("Something Went Wrong")
            alert(error)
        }
        setTimeout(() => setHelper(""), 4000)
    }

    useEffect(() => {
        const isError = Object.values(formik.errors).some(error => error !== "")
        const isEmpty = Object.values(formik.values).some(value => value === "")
        if (!isError && !isEmpty) {
            searchDrinks(formik.values)
        }
    }, [formik.values])

    const handleItemAddition = async (values) => {
        setSubmitLoading(true)
        values.quantity = values.quantity + "L"
        try {
            const response = await api.post("/bar/createDrink/", values)
            const data = await response.data
            const message = await data.message
            const isAvailable = await data.data.isAvailable
            console.log("isAvailable", isAvailable)
            setHelper(message)
            setSubmitLoading(false)
        } catch (error) {
            const data = error.response.data
            const message = data.message
            setHelper(message)
            console.log("isAvailable", data.data.isAvailable)
            setSubmitLoading(false)
        }
        setTimeout(() => setHelper(""), 4000)
    }

    if (index !== value) return null
    return (
        <Modal
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            onClose={(obj, reason) => reason === "backdropClick" ? null : handleClose()}
        >
            <Fade in={open}>
                <Box sx={style}>
                    <Typography component="h1" textAlign="center" variant="h4">
                        Add Bar Item
                    </Typography>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            formik.handleSubmit()

                        }}
                        style={{
                            display: 'flex',
                            width: width,
                            minHeight: '25rem',
                            margin: '5% auto ',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        <BranchField container={{ display: 'flex' }} sx={{ margin: '1rem', width: '20rem' }} />
                        <Autocomplete
                            error={formik.touched.type && Boolean(formik.errors.type)}
                            helper={formik.touched.type && formik.errors.type}
                            name="type"
                            value={formik.values.type}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('type', newValue)
                            }}
                            options={["Alcohol", "Soda", "Other"]}
                            renderInput={(params) => <TextField {...params} label="Type Of Beverage" type="text" />}
                            autoSelect
                            clearOnBlur
                            sx={{ width: 1, margin: '1rem 0 ' }}
                            defaultValue="Alcohol"
                            disabled={branchId ? false : true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Name"
                            pHolder="Beverage Name"
                            required
                            type="text"
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helper={formik.touched.name && formik.errors.name}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            name="name"
                            disabled={formik.values.type ? false : true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Quantity (L)"
                            pHolder="1"
                            required
                            type="number"
                            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                            helper={formik.touched.quantity && formik.errors.quantity}
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            name="quantity"
                            disabled={formik.values.name ? false : true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Cost (Rs)"
                            pHolder="1"
                            required
                            type="number"
                            error={formik.touched.cost && Boolean(formik.errors.cost)}
                            helper={formik.touched.cost && formik.errors.cost}
                            value={formik.values.cost}
                            onChange={formik.handleChange}
                            name="cost"
                            disabled={formik.values.quantity ? false : true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Price (Rs)"
                            pHolder="1"
                            required
                            type="number"
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helper={formik.touched.price && formik.errors.price}
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            name="price"
                            disabled={formik.values.quantity ? false : true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="No. Of Units"
                            pHolder="1"
                            required
                            type="number"
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helper={formik.touched.stock && formik.errors.stock}
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            name="stock"
                            disabled={formik.values.price ? false : true}
                        />
                        <Typography component="h4" variant="body2" >{helper}</Typography>
                        <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='submit' disabled={submitLoading ? true : false}>{submitLoading ? "Loading" : "Add Item"}</Button>
                        <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='button' color="error" onClick={handleClose}>Close</Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default BarAddItem