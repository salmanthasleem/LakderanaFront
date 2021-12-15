import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigator from './navigator';
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '../../Theme'
import { Outlet } from 'react-router'
import Header from './header';
import Content from './content';


const drawerWidth = 256;

const Dashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

    const handleDrawerToggle = () => {
        console.log("asdasda")
        setMobileOpen(!mobileOpen);
    };


    return (
        <>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {isSmUp ? null : (
                    <Navigator
                        PaperProps={{ style: { width: drawerWidth } }}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                    />
                )}

                <Navigator
                    PaperProps={{ style: { width: drawerWidth } }}
                    sx={{ display: { sm: 'block', xs: 'none' } }}
                />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#eaeff1' }}>
                <Header onDrawerToggle={handleDrawerToggle} />
                <Content>
                    <Outlet />
                </Content>
                <Box component="footer" sx={{ p: 2 }}>
                    <Copyright />
                </Box>
            </Box>
        </>
    )
}



function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="">
                Lakderana
            </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    );
}

export default Dashboard;


