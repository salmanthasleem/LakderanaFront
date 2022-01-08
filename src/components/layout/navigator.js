import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { level } from '../../helpers/accessLevel'
import useAuth from '../../hooks/useAuth'

const categories = [
    {
        id: 'Staff',
        children: [
            {
                id: 'Customer Handling',
                icon: <PeopleIcon />,
                active: true,
            },
            { id: 'Payments And Services', icon: <PaymentIcon /> },
            { id: 'Bar', icon: <LocalBarIcon /> },
        ],
    },
    {
        id: 'Human Resource Staff',
        children: [
            { id: 'Attendance', icon: <PeopleIcon /> },
            { id: 'Manage Staff', icon: <ManageAccountsIcon /> },
        ],
    },
    {
        id: 'Manager / Owner',
        children: [
            { id: 'Manage Rooms', icon: <RoomPreferencesIcon /> },
            { id: 'Manage Employees', icon: <EngineeringIcon /> },
            { id: 'Manage Branches', icon: <RoomPreferencesIcon /> },
            { id: 'Statistics', icon: <AnalyticsIcon /> },
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
    const [select, setSelect] = useState(0)

    const auth = useAuth()

    const empStatus = auth.userData.empStatus

    const handleClick = (childId, i) => {
        setSelect(childId + i)
        const route = childId.replaceAll(" ", "")
        navigate(`/protected/${route}`)
    }

    const whichStatus = (status) => {
        switch (status) {
            case 'Staff':
                return 'Employee'
                break;
            case 'Human Resource Staff':
                return 'HR Staff'
                break;
            case 'Manager / Owner':
                return 'Manager'
                break;
            case 'Assistant Manager':
                return 'HR Staff'
                break;
            case 'Manager':
                return 'Manager'
                break;
            case 'Owner':
                return 'Owner'
                break;
            case 'HR Staff':
                return 'HR Staff'
                break;
            default:
                return 1000
                break
        }
    }

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff', display: 'flex', justifyContent: 'space-evenly' }}>
                    <img
                        src="/hotel.png"
                        style={{ height: '10rem' }}
                    />
                </ListItem>
                {categories.map(({ id, children }) => {
                    const whichLvl = level.get(whichStatus(id))
                    const empLvl = level.get(whichStatus(empStatus))

                    console.log(empLvl, whichLvl)
                    if (empLvl === whichLvl || empLvl === 1) {
                        return (
                            <Box key={id} sx={{ bgcolor: '#101F33' }}>
                                <ListItem sx={{ py: 2, px: 3 }}>
                                    <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
                                </ListItem>
                                {children.map(({ id: childId, icon, active }, i) => {
                                    return (
                                        <ListItem disablePadding key={childId}>
                                            <ListItemButton selected={select === childId + i} sx={item} onClick={() => handleClick(childId, i)}>
                                                <ListItemIcon>{icon}</ListItemIcon>
                                                <ListItemText>{childId}</ListItemText>
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                }

                                )}

                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        )
                    }
                    return null
                })}
            </List>
        </Drawer>
    );
}
