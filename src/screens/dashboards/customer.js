import React from "react";
import { Box, Divider } from "@mui/material";
import DailyCustomerRegistrations from "../../components/stats/dailyCusRegistrations";
import CustomerInquiryStats from "../../components/stats/inquiryStats";
import BranchField from "../../components/branchField";




const CustomerFrontBoard = () => {


    return (
        <Box>
            <BranchField sx={{ margin: '1rem' }} container={{ display: 'flex' }} />
            <Box sx={{ display: 'flex', margin: '1rem', height: '80vh', justifyContent: 'space-evenly' }}>

                <DailyCustomerRegistrations />
                <Divider orientation="vertical" flexItem />
                <CustomerInquiryStats />

            </Box>
        </Box>
    )
}

export default CustomerFrontBoard