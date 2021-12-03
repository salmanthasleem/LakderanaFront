import * as React from 'react';
import Content from './content';
import Header from './header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';


const ScreenLayout = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Header onDrawerToggle={handleDrawerToggle} />
            <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
                <Content>
                </Content>
            </Box>
            <Box component="footer" sx={{ p: 2, bgcolor: '#eaeff1' }}>
                <Copyright />
            </Box>
        </Box>
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

export default ScreenLayout;


