import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Fade, Modal, Backdrop, Autocomplete, TextField } from "@mui/material";
import { Formik, useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import api from '../../../api/api'
import { useSelector, useDispatch } from "react-redux";
import { setModalOpen, setReload } from "../../../redux/slicers/inquiry";
import CustomerAutoFill from '../../../components/customerAutoFill'

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


const AddInquiry = ({ index, value, width }) => {
    const modalOpen = useSelector(state => state.inquiry.modalOpen)
    const customerAutoFill = useSelector(state => state.cusAutoFill.cValues)
    const cusName = customerAutoFill.cName
    const cusId = customerAutoFill.cId
    const dispatch = useDispatch()

    const customerInquirySchema = Yup.object({
        cName: Yup.string('Enter Your Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        cId: Yup.string('Enter Customer Id')
            .min(1, "Too Short")
            .required("Enter A Customer Id"),
        title: Yup.string('Specify Inquiry Title').min(10, 'Too Short!'),
        description: Yup.string('Specify A Small Description About The Inquiry').min(10, 'Too Short!'),
        status: Yup.string('Select Status').default("OPEN")
    })
    const formik = useFormik({
        initialValues: {
            cName: "",
            cId: "",
            title: "",
            description: "",
            status: ""
        },
        validationSchema: customerInquirySchema,
        onSubmit: val => handleInquiry(formik.values)
    })

    useEffect(() => {
        formik.setFieldValue('cName', cusName)
    }, [cusName])

    useEffect(() => {
        formik.setFieldValue('cId', cusId)
    }, [cusId])

    const handleClose = () => {
        dispatch(setModalOpen(false))
        formik.resetForm()
    };

    const handleInquiry = async (values) => {
        try {
            const req = {
                name: values.cName,
                title: values.title,
                description: values.description,
                status: values.status
            }

            const response = await api.put(`/customer/inquire/${values.cId}`, req)
            const data = await response.data.data
            dispatch(setReload(true))
            handleClose()
        } catch (error) {
            console.log(error.response.data)
        }
    }
    const helps = {
        cName: formik.touched.cName && formik.errors.cName,
        cId: formik.touched.cId && formik.errors.cId,
    }

    const errs = {
        cName: formik.touched.cName && Boolean(formik.errors.cName),
        id: formik.touched.cId && Boolean(formik.errors.cId),
    }

    const onChanges = {
        name: () => formik.setFieldValue('cName', cusName),
        id: () => formik.setFieldValue('cId', cusId)
    }
    console.log(cusName, cusId)
    if (index !== value) return null
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalOpen}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            onClose={(obj, reason) => reason === "backdropClick" ? null : handleClose()}
        >
            <Fade in={modalOpen}>
                <Box sx={style}>
                    <Typography component="h1" textAlign="center" variant="h4">
                        Add Inquiry
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
                        <CustomerAutoFill
                            errors={errs}
                            helpers={helps}
                            onchanges={onChanges}
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Title"
                            pHolder="Enter Inquiry Title"
                            required
                            type="text"
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helper={formik.touched.title && formik.errors.title}
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            name="title"
                        />
                        <_TextField
                            sx={{ padding: '5px' }}
                            label="Description"
                            pHolder="Describe Inquiry"
                            required
                            type="text"
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helper={formik.touched.description && formik.errors.description}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            name="description"
                            multiline={true}
                            rows={4}
                        />
                        <Autocomplete
                            error={formik.touched.status && Boolean(formik.errors.status)}
                            helper={formik.touched.status && formik.errors.status}
                            name="status"
                            value={formik.values.status}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('status', newValue)
                            }}
                            options={["Open", "Close", "Processing"]}
                            renderInput={(params) => <TextField {...params} label="Select Inquiry Status" type="text" />}
                            autoSelect
                            clearOnBlur
                            sx={{ width: 1, margin: '1rem 0 ' }}
                            defaultValue="Open"

                        />
                        <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='submit'  >Add Inquiry</Button>
                        <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='button' color="error" onClick={handleClose}>Close</Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default AddInquiry