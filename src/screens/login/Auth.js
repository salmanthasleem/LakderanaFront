import React from "react";
import { Container, Paper, Grid, Tab, Tabs } from "@mui/material";
import theme from "../../Theme";
import { display } from "@mui/system";
import { useNavigate } from "react-router";
import { useState } from "react";
import SignUp from "../../components/auth/signUp";
import SignIn from "../../components/auth/signIn";

const Auth = () => {
    let navigate = useNavigate();

    const [value, setValue] = useState("signIn")

    const handleChange = (e, value) => {
        setValue(value)
    }

    return (
        <Container sx={{
            bgcolor: 'primary.dark',
            minHeight: '100vh',
            minWidth: 1,

        }}
        >
            <Grid container
                sx={{
                    minHeight: '100vh',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Paper elevation={24}
                    square
                    sx={{
                        bgcolor: 'primary.light',
                        minHeight: '25rem',
                        width: '40rem',
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
                    <SignUp value={value} index="signUp" navigate={navigate} />
                </Paper>
            </Grid>
        </Container>
    )
}

export default Auth