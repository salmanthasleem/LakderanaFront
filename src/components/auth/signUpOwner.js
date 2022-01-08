import React, { useState, useEffect, useRef } from "react";
import { Button, Box, Divider, Autocomplete, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from 'yup'
import _TextField from './textField'
import useAuth from '../../hooks/useAuth'
import { useDispatch, useSelector } from 'react-redux'
import { setIsOwnerAsync } from '../../redux/slicers/authSlice'
require('dotenv').config()


const loadScript = (url) => {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
};


let minDate = new Date()
let maxDate = new Date()
minDate.setFullYear(minDate.getFullYear() - 70, 0, 1)
maxDate.setFullYear(maxDate.getFullYear() - 18, 0, 1)

const SignUpOwner = ({ index, value, navigate }) => {
    const [places, setPlaces] = useState([])
    const [query, setQuery] = useState("")
    const auth = useAuth()
    const dispatch = useDispatch()
    const isOwner = useSelector(state => state.auth.isOwner)


    const signUpSchema = Yup.object({
        fName: Yup.string('Enter Your First Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        lName: Yup.string('Enter Your Last Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        uName: Yup.string('Enter Your User Name')
            .min(2, 'Too Short!')
            .max(60, 'Too Long!')
            .required('Required'),
        dob: Yup.date('Enter Your Date Of Birth')
            .min(minDate, "Too Old")
            .max(maxDate, "Too Young")
            .required("Date Of Birth Required"),
        password: Yup.string('Enter A Password')
            .min(7, "Too Short")
            .required("Enter A Password"),
        confirmPass: Yup.string('Enter A Same Password')
            .oneOf([Yup.ref("password"), null], "Passwords Must Match")
            .required('Required Field & Passwords Must Match'),
        location: Yup.string('Enter Branch Location').required('Required').test('isLocation', "Select An Available Value", (val) => {
            return places.find(place => place === val)
        }),
        branchName: Yup.string('Enter Branch Name').required('Required'),
    })

    const formik = useFormik({
        initialValues: {
            fName: "salman",
            lName: "thasleem",
            uName: "",
            dob: "02/02/1999",
            password: "salman123",
            confirmPass: "salman123",
            branchName: "branch",
            location: ""
        },
        validationSchema: signUpSchema,
        onSubmit: () => {
            handleSubmit(formik.values)
        }
    })

    const handleScript = (query) => {
        const options = {
            types: ['(cities)'],
            componentRestrictions: { 'country': ['LK'] },
        }


        var autocomplete = new window.google.maps.places.AutocompleteService()
        autocomplete.getPlacePredictions({
            input: query,
            ...options
        }, (predictions, status) => {
            if (status != window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
                return
            }

            const places = predictions.map(place => place.description)
            setPlaces(places)
        })


    }

    useEffect(async () => {
        await dispatch(setIsOwnerAsync(true))
        if (!isOwner) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_PLACESAPI}&libraries=places&callback=initMap`
            );
        }
    }, [isOwner])


    const handleSubmit = async ({ fName: firstName, lName: lastName, dob, uName: userName, password, confirmPass: confirmPassword, branchName, location }) => {
        await setQuery(formik.values.location)
        const registerValues = {
            firstName,
            lastName,
            dob,
            branchName,
            location,
            status: "Owner"
        }
        const ownerCredentials = {
            userName,
            password,
            confirmPassword
        }
        auth.signUpOwner(registerValues, ownerCredentials)
    }
    console.log(isOwner)
    if (index !== value) return null
    return (
        isOwner === true ?
            <Box sx={{
                display: 'flex',
                margin: '10% auto',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly'
            }}>
                <Typography component="h2" >
                    Owner Already Registered
                </Typography>
            </Box>
            : <form

                sx={{
                    display: 'flex',
                    margin: '10% auto',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onSubmit={(e) => {
                    e.preventDefault()
                    formik.handleSubmit()
                }}
            >
                <Box sx={{
                    display: 'flex',
                    margin: '10% auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: 1 / 3, alignItems: 'center' }}>
                        <Box sx={{ minHeight: '15rem' }}>
                            <_TextField
                                label="First Name"
                                pHolder="Name"
                                required
                                type="text"
                                error={formik.touched.fName && Boolean(formik.errors.fName)}
                                helper={formik.touched.fName && formik.errors.fName}
                                value={formik.values.fName}
                                onChange={formik.handleChange}
                                margin="dense"
                                name="fName"
                            />
                            <_TextField
                                label="Last Name"
                                pHolder="Name"
                                required
                                type="text"
                                error={formik.touched.lName && Boolean(formik.errors.lName)}
                                helper={formik.touched.lName && formik.errors.lName}
                                value={formik.values.lName}
                                onChange={formik.handleChange}
                                margin="dense"
                                name="lName"
                            />
                            <_TextField
                                label="DOB"
                                pHolder="DOB"
                                required
                                type='date'
                                error={formik.touched.dob && Boolean(formik.errors.dob)}
                                helper={formik.touched.dob && formik.errors.dob}
                                shrink={true}
                                value={formik.values.dob}
                                onChange={formik.handleChange}
                                margin="dense"
                                name="dob"
                            />
                        </Box>
                        <Box sx={{ minHeight: '10rem' }}>
                            <_TextField
                                label="User Name"
                                pHolder="Name"
                                required
                                type="text"
                                error={formik.touched.uName && Boolean(formik.errors.uName)}
                                helper={formik.touched.uName && formik.errors.uName}
                                value={formik.values.uName}
                                onChange={formik.handleChange}
                                margin="dense"
                                name="uName"
                            />
                            <_TextField
                                label="Password"
                                pHolder="Password"
                                required
                                type="password"
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helper={formik.touched.password && formik.errors.password}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                margin="dense"
                                name="password"
                            />
                            <_TextField
                                label="Confirm Password"
                                pHolder="Confirm Password"
                                required
                                type="password"
                                error={formik.touched.confirmPass && Boolean(formik.errors.confirmPass)}
                                helper={formik.touched.confirmPass && formik.errors.confirmPass}
                                value={formik.values.confirmPass}
                                onChange={formik.handleChange}
                                margin="dense"
                                name="confirmPass"
                            />
                        </Box>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    <Box sx={{ width: 1 / 3 }}>
                        <_TextField
                            label="Branch Name"
                            pHolder="Lakderana"
                            required
                            type="text"
                            error={formik.touched.branchName && Boolean(formik.errors.branchName)}
                            helper={formik.touched.branchName && formik.errors.branchName}
                            value={formik.values.branchName}
                            onChange={formik.handleChange}
                            name="branchName"
                        />
                        <Box>
                            <Autocomplete
                                freeSolo
                                disableClearable
                                options={places}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Location"
                                        name="location"
                                        InputProps={{
                                            ...params.InputProps,
                                            type: 'search',
                                        }}
                                    />
                                )}
                                onInputChange={(e, val) => {
                                    handleScript(val)
                                    setQuery(val)
                                    formik.setFieldValue('location', "")
                                }}
                                onChange={(e, val) => {
                                    formik.setFieldValue('location', val)
                                    setQuery(val)
                                }}
                                inputValue={query}
                                loading={places ? false : true}
                                value={formik.values.location}
                                label="Location"
                                name="location"
                            />
                            {formik.touched.location && Boolean(formik.errors.location) &&
                                <Typography color="red"  >
                                    {formik.touched.location && formik.errors.location}
                                </Typography>}
                        </Box>
                    </Box>

                </Box>


                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" fullWidth type='submit' sx={{ width: 1 / 3 }}  >Register As Owner</Button>
                </Box>
            </form>

    )
}

export default SignUpOwner