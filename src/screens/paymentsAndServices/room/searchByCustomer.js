import React from "react";
import _TextField from '../../../components/auth/textField'
import { Box, Autocomplete, TextField } from "@mui/material";


const SearchByCustomer = () => {
    return (
        <Box >
            <Box>
                <Autocomplete
                    options={["example", "example1", "example2"]}
                    freeSolo
                    disableClearable
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search  Customer"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                        />
                    )}
                />
                {/* 
                <_TextField
                    label="Search Customer"
                    pHolder="Enter Customer Name"
                    required
                    type='text'

                    name="search"
                /> */}
            </Box>
            <Box sx={{ width: 2 / 3, height: '15rem', alignItems: 'flex-end', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <_TextField
                    label="Customer Name"
                    value={"example"}
                    shrink={true}
                    required
                    type='text'
                    margin="dense"
                    disabled={true}
                    fullwidth={false}
                    size="small"
                />
                <_TextField
                    label="Mobile Number"
                    value={"example"}
                    shrink={true}
                    required
                    type='text'
                    margin="dense"
                    disabled={true}
                    fullwidth={false}
                    size="small"
                />
                <_TextField
                    label="Id/Passport"
                    value={"example"}
                    shrink={true}
                    required
                    type='text'
                    margin="dense"
                    disabled={true}
                    fullwidth={false}
                    size="large"
                />
            </Box>
        </Box>
    )
}

export default SearchByCustomer