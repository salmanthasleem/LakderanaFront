import React from "react";
import { TextField } from "@mui/material";

const _TextField = (props) => {
    return (
        <TextField
            label={props.label}
            name={props.name}
            placeholder={props.pHolder}
            required={props.required}
            type={props.type}
            fullWidth={props.fullWidth || true}
            value={props.value}
            onChange={props.onChange}
            color={props.error ? 'warning' : 'secondary'}
            error={props.error}
            helperText={props.helper}
            margin={props.margin || 'normal'}
            InputLabelProps={{
                shrink: props.shrink,
            }}
            size={props.size}
            sx={props.sx}
            variant={props.variant}
            focused={props.focused}
            disabled={props.disabled}
            defaultValue={props.default}
            rows={props.rows}
            multiline={props.multiline}
        />
    )
}

export default _TextField