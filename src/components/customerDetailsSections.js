import { Box } from "@mui/material";
import CustomerRegistrationFields from "./customerRegistrationFields"
import CustomerAutoFill from "./customerAutoFill"


const CustomerDetailsSection = ({ errors, helpers, onchanges, values, width, newCus, oldCus }) => {
    return (
        <Box sx={{ width: width }}>
            {newCus && <CustomerRegistrationFields
                helpers={helpers.helps}
                errors={errors.errs}
                values={values}
                onChanges={onchanges.handleChange}
            />
            }
            {oldCus && <CustomerAutoFill mobileNo={true} identity={true}
                errors={errors.errsAutoFill}
                helpers={helpers.helpsAutoFill}
                onchanges={onchanges.onChangesAutoFill}
            />}
        </Box>
    )
}

export default CustomerDetailsSection