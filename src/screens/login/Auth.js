import React from "react";
import { Container, Paper, Grid, Tab, Tabs } from "@mui/material";
import theme from "../../Theme";
import { display } from "@mui/system";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import SignIn from "../../components/auth/signIn";
import SignUpOwner from "../../components/auth/signUpOwner";
import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";

const Auth = () => {
    let navigate = useNavigate();
    const isOwner = useSelector(state => state.auth.isOwner)
    const [owner, setOwner] = useState(isOwner)

    useEffect(() => {
        setOwner(isOwner)
        console.log(isOwner)
    }, [isOwner])

    const [value, setValue] = useState("signIn")

    const handleChange = (e, value) => {
        setValue(value)
    }

    return (
        <Container sx={{
            bgcolor: 'primary.dark',
            minHeight: '100vh',
            minWidth: '100vw',

        }}
        >
            <Box sx={{ minWidth: '100vw', transform: 'translateX(-0.8%)', display: 'flex', justifyContent: 'center', backgroundColor: 'primary.light', color: 'primary.dark', height: '10rem', alignItems: 'center' }}>
                <img
                    src="/hotel.png"
                    style={{ width: '20rem', height: '10rem' }}
                />
                <Typography component="h1" variant="h1"  >Lakderana Integrated System</Typography>
            </Box>
            <Grid container
                sx={{
                    minHeight: '80vh',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Paper elevation={24}
                    square
                    sx={{
                        bgcolor: 'primary.light',
                        minHeight: value === "signIn" ? '25rem' : value === "signIn" && owner ? "60rem" : '25rem',
                        width: value === "signIn" ? '40rem' : value === "signIn" && owner ? "80rem" : '40rem',
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="inherit"
                        indicatorColor="secondary"
                        aria-label="auth tabs"
                        sx={{ marginLeft: 0 }}
                        variant='fullWidth'
                    >
                        <Tab value="signIn" label="Sign In" sx={{ margin: 'auto' }} />
                        <Tab value="signUp" label="Register" sx={{ margin: 'auto' }} />
                    </Tabs>
                    <SignIn value={value} index="signIn" navigate={navigate} />
                    <SignUpOwner value={value} index="signUp" navigate={navigate} />
                </Paper>
            </Grid>
        </Container>
    )
}

export default Auth