import React from "react";
import { AuthContext } from "../../context/authContext";

const AuthProvider = ({ children }) => {

    return <AuthContext.Provider>
        {children}
    </AuthContext.Provider>
}

export default AuthProvider