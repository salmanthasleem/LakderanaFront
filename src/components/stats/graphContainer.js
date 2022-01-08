import { Box, Typography } from "@mui/material";
import { ResponsiveContainer } from 'recharts';
import { useState } from "react";



const GraphContainer = ({ children, components, title, style, values }) => {



    return (
        <Box sx={{ width: 3 / 7, height: '80rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px  solid lightgrey', margin: '0 2rem 10rem', ...style }}>
            <Typography component="h2" variant="h4" >{title}</Typography>
            <ResponsiveContainer width="90%" height="75%"  >
                {children}
            </ResponsiveContainer>
            {components}
        </Box>
    )
}

export default GraphContainer