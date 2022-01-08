import React from "react";
import _TextField from "./auth/textField";



const CustomerRegistrationFields = ({ errors, helpers, values, onChanges }) => {

    return (
        <>
            <_TextField
                label="Name"
                pHolder="Name"
                required
                type="text"
                error={errors.name}
                helper={helpers.name}
                value={values.name}
                onChange={onChanges}
                name="name"
            />
            <_TextField
                label="Mobile Number"
                pHolder="947XXXXXXXX / Foreign Mobile Number"
                required
                type='number'
                error={errors.mobile}
                helper={helpers.mobile}
                value={values.mobile}
                onChange={onChanges}
                shrink={true}
                name="mobile"
            />
            <_TextField
                label="ID/Passport No"
                pHolder="XXXXXXXXXV / XXXXXXXXXX / NXXXXXXX"
                required
                type="text"
                error={errors.identity}
                helper={helpers.identity}
                value={values.identity}
                onChange={onChanges}
                name="identity"
            />
        </>
    )
}

export default CustomerRegistrationFields