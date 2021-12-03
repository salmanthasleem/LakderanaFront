import React from "react";
import { AuthContext } from "../context/authContext";

export default function useAuth() {
    return React.useContext(AuthContext)
}