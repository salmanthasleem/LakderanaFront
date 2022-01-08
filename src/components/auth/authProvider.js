import React from "react";
import { AuthContext } from "../../context/authContext";
import api from "../../api/api";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }) => {
    const navigate = useNavigate()

    const data = window.localStorage.getItem("@user") || null
    const userData = data ? JSON.parse(data) : null


    const signIn = async (values) => {
        try {
            const response = await api.post("/auth/login/", values)
            const status = response.data.data.status
            if (status === 1) {
                const userData = JSON.stringify(response.data.data)
                console.log(userData)
                await window.localStorage.setItem("@user", userData)
                navigate("/protected/CustomerHandling")
            }
        } catch (error) {

        }
    }

    const signUp = async (values) => {
        try {
            const response = await api.post("/auth/new/", values)
            console.log(response)
            navigate("/protected/CustomerHandling")

        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

    }

    const signUpOwner = async (values, credentials) => {
        try {
            const response = await api.post("/auth/new/", values)
            const empId = response.data.data.id
            credentials.employeeId = empId
            const empCredentialsRes = await api.post("/auth/newCreds/", credentials)
            const credentialsRes = empCredentialsRes.data.data
            const userData = JSON.stringify(credentialsRes)
            console.log(userData)
            await window.localStorage.setItem("@user", userData)
            console.log(credentialsRes)
            navigate("/protected/CustomerHandling")

        } catch (error) {
            console.log(error);
            // console.log(error);
            // console.log(error.response.headers);
        }

    }

    const getOwner = async () => {
        try {
            const response = await api.get("/auth/owner/")
            return await response.data.data.bool
        } catch (error) {
            console.log(error.response.data);
        }
    }


    const value = { signUp, getOwner, signUpOwner, signIn, userData }
    return <AuthContext.Provider value={value} >
        {children}
    </AuthContext.Provider>
}

export default AuthProvider