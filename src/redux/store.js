import { configureStore } from "@reduxjs/toolkit";
import auth from "./slicers/authSlice";
import inquiry from "./slicers/inquiry";
import cusAutoFill from "./slicers/cusAutoFill";
import branch from "./slicers/branchSlice";
import searchEmployee from "./slicers/employeeslice"
import beverage from "./slicers/beverage";
import barItem from './slicers/addItemModalSlice'
import restockBarItem from './slicers/restockItem'
import gLocation from "./slicers/gLocation";

export default configureStore({
    reducer: {
        auth: auth,
        inquiry: inquiry,
        cusAutoFill: cusAutoFill,
        branch: branch,
        searchEmployee: searchEmployee,
        beverage: beverage,
        barItem: barItem,
        restockBarItem: restockBarItem,
        gLocation: gLocation,
    },
})