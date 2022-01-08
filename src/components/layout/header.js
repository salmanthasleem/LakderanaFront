import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Tab } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { NavLink, useLocation, Link as LinkRouter } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const sections = {
    CustomerHandling: {
        section: "Customer Handling",
        subSections: [
            {
                label: "Customer Inquiry",
                path: "/protected/CustomerHandling/CustomerInquiry"
            },
            {
                label: "Customer Registration",
                path: "/protected/CustomerHandling/CustomerRegistration"
            },
            {
                label: "In-Hotel Customers",
                path: "/protected/CustomerHandling/InHotelCustomers"
            },
        ]

    },
    PaymentsAndServices: {
        section: "Payments And Services",
        subSections: [
            {
                label: "Reserve Room",
                path: "/protected/PaymentsAndServices/ReserveRoom"
            },
            {
                label: "Services",
                path: "/protected/PaymentsAndServices/Services"
            },
        ]

    },
    Statistics: {
        section: "Statistics",
        subSections: [
            {
                label: "Bar",
                path: "/protected/Statistics/BarStatsDaily"
            },
            {
                label: "Attendance",
                path: "/protected/Statistics/AttendaceStats"
            },
            {
                label: "Income",
                path: "/protected/Statistics/IncomeStats"
            },
        ]
    },
    Bar: {
        section: "Bar",
        subSections: [
            {
                label: "Front Desk",
                path: "/protected/Bar/FrontDesk"
            },
            {
                label: "Inventory",
                path: "/protected/Bar/Inventory"
            },
        ]

    },
    Attendance: {
        section: "Attendance",
        subSections: [
            {
                label: "Attendance",
                path: "/protected/Attendance"
            },
        ]

    },
    ManageStaff: {
        section: "Manage Staff",
        subSections: [
            {
                label: "Configure Salary",
                path: "/protected/ManageStaff/ConfigureSalary"
            },
            {
                label: "Employee Details",
                path: "/protected/ManageStaff/EmployeeDetails"
            },
        ]

    },
    ManageRooms: {
        section: "Manage Rooms",
        subSections: [
            {
                label: "Add Room",
                path: "/protected/ManageRooms/AddRoom"
            },
            {
                label: "View Rooms",
                path: "/protected/ManageRooms/ViewRooms"
            },
        ]

    },
    ManageEmployees: {
        section: "Manage Employees",
        subSections: [
            {
                label: "Add Employee",
                path: "/protected/ManageEmployees/AddEmployee"
            },
        ]

    },
    ManageBranches: {
        section: "Manage Branches",
        subSections: [
            {
                label: "Add Branch",
                path: "/protected/ManageBranches/AddBranch"
            },
            {
                label: "View Branches",
                path: "/protected/ManageBranches/ViewBranches"
            },
        ]

    },
}



function Header(props) {
    const auth = useAuth()
    const userData = auth.userData
    const location = useLocation().pathname

    const section = Object.keys(sections).find(sub => {
        const regex = new RegExp(sub)
        if (regex.test(location)) {
            return sub
        }
    })
    const { onDrawerToggle } = props;

    return (
        <React.Fragment>
            <AppBar sx={{ backgroundColor: '#081627', borderLeft: "2px solid grey" }} position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={onDrawerToggle}
                                edge="start"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item xs container sx={{ height: '9em' }}  >
                            <Grid item container direction="row" columnGap={10} sx={{ margin: '1rem 2.5rem' }}>
                                <Grid item  >
                                    <Typography>{userData.userName}</Typography>
                                </Grid>
                                <Grid item  >
                                    <Typography>{userData.empStatus}</Typography>
                                </Grid>
                                <Grid item  >
                                    <Typography>Branch No: {userData.branchId || ""}</Typography>
                                </Grid>
                            </Grid>


                            <Grid item>
                                <Tabs sx={{ display: 'flex', alignItems: 'flex-end' }} >
                                    {sections[section].subSections.map((item, i) =>

                                        <NavLink
                                            style={({ isActive }) =>
                                            ({
                                                display: "block",
                                                margin: "1rem ",
                                                color: isActive ? "#009be5" : "white"
                                            })}
                                            to={item.path}
                                            key={section + ` ${i}`}
                                        >
                                            <Tab label={item.label} />
                                        </NavLink>
                                    )}
                                </Tabs>
                            </Grid>
                        </Grid>
                        <Grid item direction="column">
                            <Grid item container direction="row" columnGap={15} sx={{ marginRight: '2.5rem' }}>
                                <Grid item>
                                    <Tooltip title="Alerts • No alerts">
                                        <IconButton color="inherit">
                                            <NotificationsIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>

                                <Grid item>
                                    <Tabs>
                                        <NavLink
                                            style={({ isActive }) =>
                                            ({
                                                color: isActive ? "#009be5" : "white"
                                            })}
                                            to={"/"}
                                            key={"login"}
                                        >
                                            <Tab label="Log Out" />
                                        </NavLink>
                                    </Tabs>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment >
    );
}

Header.propTypes = {
    onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
