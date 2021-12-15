import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Dashboard from './dashboard'
import Auth from '../../screens/login/Auth';
import { Outlet } from 'react-router';



export default function Layout({ children }) {

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />
            <Outlet />
        </Box>
    );
}
