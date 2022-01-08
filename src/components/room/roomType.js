import React, { useState } from 'react'
import { Button, Autocomplete, TextField, Box, Divider, Checkbox, FormControlLabel, Radio, RadioGroup, FormLabel, Typography, Switch } from "@mui/material";
import _TextField from '../auth/textField'
import BranchField from '../branchField';


const RoomType = ({ newroom, existingRoom, errors, helpers, onchanges }) => {
    const [newCus, setNewCus] = useState(true)

    return (
        <Box sx={{ width: '30%' }}>
            <FormControlLabel label="New Customer"
                control={
                    <Switch
                        checked={newCus}
                        onChange={() => setNewCus(!newCus)}
                    />
                }
            />
            {newroom &&
                <Box>
                    <BranchField />
                    <_TextField
                        label="Room Number"
                        pHolder="XXXXX"
                        required
                        type='number'
                        error={formik.touched.roomNo && Boolean(formik.errors.roomNo)}
                        helper={formik.touched.roomNo && formik.errors.roomNo}
                        onChange={formik.handleChange}
                        value={formik.values.roomNo}
                        shrink={true}
                        name="roomNo"
                    />
                    <Box sx={{ margin: '1rem', width: 1, display: 'flex', justifyContent: 'space-evenly' }}>
                        <FormLabel component="div" sx={{ width: 1, margin: '1rem' }}>Room Type
                            <RadioGroup
                                aria-label="gender"
                                name="roomType"
                                value={type}
                                onChange={handleRoomType}
                                row
                                sx={{ width: 1, margin: '1rem 0' }}
                            >
                                <FormControlLabel value="normal" sx={{ margin: "0 2rem" }} control={<Radio />} label="Normal" />
                                <FormControlLabel value="deluxe" sx={{ margin: "0 2rem" }} control={<Radio />} label="Deluxe" />
                                <FormControlLabel value="other" sx={{ margin: "0 2rem" }} control={<Radio />} label="Other" />
                                {type === "other" && <_TextField
                                    label="Type"
                                    pHolder="normal"
                                    required
                                    type='text'
                                    shrink={true}
                                    value={formik.values.roomType}
                                    onChange={handleOtherRoomType}
                                    name="otherRoom"

                                />}

                            </RadioGroup>
                            {
                                formik.touched.roomType && Boolean(formik.errors.roomType) &&
                                <Typography component="p" variant="caption" sx={{ color: 'red' }}>{formik.touched.roomType && formik.errors.roomType}</Typography>
                            }
                        </FormLabel>
                    </Box>
                </Box>
            }
            {
                existingRoom &&
                <>
                    <BranchField />
                </>
            }
        </Box>
    )
}


export default RoomType