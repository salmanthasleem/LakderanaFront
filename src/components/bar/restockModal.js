import React, { useState, useEffect, useRef } from "react";
import { Button, Typography, Box, Fade, Modal, Backdrop, Autocomplete, TextField } from "@mui/material";
import { Formik, useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../auth/textField'
import { useSelector, useDispatch } from "react-redux";
import { setRestockModalOpen, setParamsAsync } from '../../redux/slicers/restockItem'
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


const RestockItem = ({ index, value, width }) => {
    const dispatch = useDispatch()
    const restockBarItem = useSelector(state => state.restockBarItem)
    const open = restockBarItem.restockModalOpen
    const params = restockBarItem.itemParams
    const isParams = !Object.values(params).some(param => param === "")
    const [submitLoading, setSubmitLoading] = useState(false)
    const initialCost = useRef(null)
    const [helper, setHelper] = useState("")

    const addBarItemSchema = Yup.object({
        itemId: Yup.number("Specify Branch Id").required('Required Value'),
        stock: Yup.number('Specify The Number Of Units').min(0, 'Invalid Value').required('Required Value'),
        branchId: Yup.number("Specify Branch Id").required('Required Value')
    })
    const formik = useFormik({
        initialValues: {
            itemId: "",
            stock: "",
            branchId: "",
        },
        validationSchema: addBarItemSchema,
        onSubmit: val => handleItemAddition(formik.values)
    })


    const setFields = () => {
        if (isParams) {
            formik.setFieldValue('itemId', params.itemId)
            formik.setFieldValue('stock', params.stock)
            formik.setFieldValue('branchId', params.branchId)

            initialCost.current = params.stock
        }
    }

    const handleClose = () => {
        dispatch(setRestockModalOpen(false))
    };


    const handleItemAddition = async (values) => {
        setSubmitLoading(true)
        try {
            const response = await api.put("/bar/restockItem/", values)
            const data = await response.data
            const message = await data.message
            const isSuccess = await data.data.isSuccess
            console.log("isSuccess", isSuccess)
            setHelper(message)
            setSubmitLoading(false)
            if (isSuccess) {
                const values = {
                    ...params,
                    stock: formik.values.stock
                }
                dispatch(setParamsAsync(values))
            }
        } catch (error) {
            const data = error.response.data
            const message = data.message
            setHelper(message)
            console.log("isSuccess", data.data.isSuccess)
            setSubmitLoading(false)
        }
        setTimeout(() => setHelper(""), 4000)
    }

    if (index !== value) return null
    return (
        <Modal
            open={open && isParams}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            onClose={(obj, reason) => reason === "backdropClick" ? null : handleClose()}

        >
            <Fade in={open} onEnter={setFields}>
                <Box sx={style}>
                    <Typography component="h1" textAlign="center" variant="h4">
                        Restock Bar Item
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

                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Item Id"
                            required
                            type="number"
                            value={params.itemId}
                            name="itemId"
                            disabled={true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Branch Id"
                            required
                            type="number"
                            value={params.branchId}
                            name="branchId"
                            disabled={true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Beverage Type"
                            required
                            type="text"
                            value={params.type}
                            disabled={true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Beverage Name"
                            required
                            type="text"
                            value={params.name}
                            disabled={true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Quantity"
                            required
                            type="text"
                            value={params.quantity}
                            disabled={true}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="No Of Units"
                            pHolder="1"
                            required
                            type="number"
                            error={formik.touched.stock && Boolean(formik.errors.stock)}
                            helper={formik.touched.stock && formik.errors.stock}
                            value={formik.values.stock}
                            onChange={formik.handleChange}
                            name="stock"
                        />
                        <Typography component="h4" variant="body2" >{helper}</Typography>
                        <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='submit' disabled={submitLoading ? true : formik.values.stock === params.stock ? true : false}>{submitLoading ? "Loading" : "Restock"}</Button>
                        <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='button' color="error" onClick={handleClose}>Close</Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default RestockItem