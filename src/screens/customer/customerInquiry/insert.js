import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Fade, Modal, Backdrop, Autocomplete, TextField } from "@mui/material";
import { Formik, useFormik } from "formik";
import * as Yup from 'yup';
import _TextField from '../../../components/auth/textField'
import api from '../../../api/api'
import { useSelector, useDispatch } from "react-redux";
import { setStatusModal, setReload } from "../../../redux/slicers/inquiry";

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


const InsertStatus = ({ index, value, width, row },) => {
    const statusModalOpen = useSelector(state => state.inquiry.statusModal)
    const dispatch = useDispatch()
    const [branchId, setBranchId] = useState("")
    const { id, cId, description, name, title } = row
    let status = row.status
    const [isStatusChanged, setStatusChanged] = useState(false)

    const customerStatusSchema = Yup.object({
        cName: Yup.string('Enter Your Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        cId: Yup.string('Enter Customer Id')
            .min(1, "Too Short")
            .required("Enter A Customer Id"),
        title: Yup.string('Specify Inquiry Title').min(10, 'Too Short!'),
        description: Yup.string('Specify A Small Description About The Inquiry').min(10, 'Too Short!'),
        status: Yup.string('Select Status').default("Open")
    })
    const formik = useFormik({
        initialValues: {
            cName: name,
            cId: cId,
            title: title,
            description: description,
            status: status
        },
        validationSchema: customerStatusSchema,
        onSubmit: val => handleInquiryStatus(formik.values)
    })

    const handleClose = () => {
        dispatch(setStatusModal(false))
        formik.resetForm()
    };


    useEffect(async () => {
        const user = await window.localStorage.getItem("@user")
        const branchId = await JSON.parse(user).branchId
        setBranchId(branchId)
    }, [])

    useEffect(() => {
        if (status !== formik.values.status) {
            setStatusChanged(true)
        } else {
            setStatusChanged(false)
        }
    }, [formik.values.status])

    const handleInquiryStatus = async (values) => {
        try {
            const req = {
                status: values.status
            }

            const response = await api.put(`/customer/${cId}/${id}`, req)
            status = values.status
            handleClose()
            dispatch(setReload(true))
            status = values.status
            formik.setFieldValue('status', status)
            status = formik.values.status
            setStatusChanged(false)
        } catch (error) {
            console.log(error.response.data)
        }
    }
    console.log(formik.values.status)
    if (index !== value) return null
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={statusModalOpen}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
            onClose={(obj, reason) => reason === "backdropClick" ? null : handleClose()}
        >
            <Fade in={statusModalOpen}>
                <Box sx={style}>
                    <Typography component="h1" textAlign="center" variant="h4">
                        Change Inquiry Status
                    </Typography>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (formik.values.status !== status) {
                                formik.handleSubmit()
                            }

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
                            disabled={true}
                            sx={{ padding: '5px' }}
                            label="Customer Name"
                            type="text"
                            value={name}
                            name="cName"
                        />
                        <_TextField
                            disabled={true}
                            sx={{ padding: '5px' }}
                            label="Customer Id"
                            type="text"
                            value={cId}
                            name="cId"
                        />
                        <_TextField
                            disabled={true}
                            sx={{ padding: '5px' }}
                            label="Title"
                            type="text"
                            value={title}
                            name="title"
                        />
                        <_TextField
                            disabled={true}
                            sx={{ padding: '5px' }}
                            label="Description"
                            type="text"
                            value={description}
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

                        />
                        {isStatusChanged && <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='submit'  >Change Status</Button>}
                        <Button variant="contained" fullWidth sx={{ margin: '1rem 0 0' }} type='button' color="error" onClick={handleClose}>Close</Button>
                    </form>
                </Box>
            </Fade>
        </Modal>
    )
}

export default InsertStatus