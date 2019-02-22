import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Grid from '@material-ui/core/Grid';
import { Calendar as ReactCalendar } from 'react-calendar';


const Calendar = () => (
    <Grid container spacing={ 32 }>
        <Grid item md={ 4 } sm={7} xs={12}>
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon/> }>
                    <Typography variant='body2'>Calendar</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <ReactCalendar
                        value={new Date()}
                    />
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Grid>
    </Grid>
);

export default Calendar;