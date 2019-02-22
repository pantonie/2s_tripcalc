import UniversalForm from "./universalForm";
import React from "react";
import TextField from '@material-ui/core/TextField';

const Trip = (props) => (
    <UniversalForm { ...props } >
        <TextField
            autoFocus
            requred="true"
            id="startDate"
            name='tripData'
            label="Start"
            type="date"
            defaultValue={ props.startdate }
            onChange={ props.handleInputChange }
            InputLabelProps={ {
                shrink: true,
            } }
        />
        <TextField
            requred="true"
            id="endDate"
            name="tripData"
            label="End"
            type="date"
            defaultValue={ props.enddate }
            onChange={ props.handleInputChange }
            InputLabelProps={ {
                shrink: true,
            } }
        />
        <TextField
            inputProps={ { maxLength: 40 } }
            id="comment"
            name="tripData"
            type="text"
            label='Comment'
            defaultValue={ props.comment }
            onChange={ props.handleInputChange }
        />
    </UniversalForm>
);

export default Trip;