import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PermMediaOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActual';
import PublicIcon from '@mui/icons-material/Public';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import { useNavigate } from 'react-router';

const categories = [
    {
        id: 'Staff',
        children: [
            {
                id: 'Customer Handling',
                icon: <PeopleIcon />,
                active: true,
            },
            { id: 'Payments And Services', icon: <DnsRoundedIcon /> },
            { id: 'Bar', icon: <PermMediaOutlinedIcon /> },
            // { id: 'Hosting', icon: <PublicIcon /> },
            // { id: 'Functions', icon: <SettingsEthernetIcon /> },
            // {
            //     id: 'Machine learning',
            //     icon: <SettingsInputComponentIcon />,
            // },
        ],
    },
    {
        id: 'Human Resource Staff',
        children: [
            { id: 'Attendance', icon: <SettingsIcon /> },
            { id: 'Manage Staff', icon: <TimerIcon /> },
            // { id: 'Test Lab', icon: <PhonelinkSetupIcon /> },
        ],
    },
    {
        id: 'Manager',
        children: [
            { id: 'Manage Rooms', icon: <SettingsIcon /> },
            { id: 'Manage Employees', icon: <TimerIcon /> },
            { id: 'Statistics', icon: <PhonelinkSetupIcon /> },
        ],
    },
];

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
};

const itemCategory = {
    boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
    py: 4,
    px: 3,
};

export default function Navigator(props) {
    const navigate = useNavigate()
    const { ...other } = props;

    const [select, setSelect] = React.useState(0)

    const handleClick = (childId, i) => {
        setSelect(childId + i)
        const route = childId.replaceAll(" ", "")
        navigate(`/protected/${route}`)
    }

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
                    Lakderana
                </ListItem>
                {categories.map(({ id, children }) => (
                    <Box key={id} sx={{ bgcolor: '#101F33' }}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
                        </ListItem>
                        {children.map(({ id: childId, icon, active }, i) => (
                            <ListItem disablePadding key={childId}>
                                <ListItemButton selected={select === childId + i} sx={item} onClick={() => handleClick(childId, i)}>
                                    <ListItemIcon>{icon}</ListItemIcon>
                                    <ListItemText>{childId}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </List>
        </Drawer>
    );
}
