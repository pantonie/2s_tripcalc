import React from 'react';
import { withAuthorization, withEmailVerification } from '../session';
import { withFirebase } from '../firebase';
import { compose } from 'recompose';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from "@material-ui/core/es/Typography/Typography";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from "@material-ui/core/es/Button/Button";
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import teal from '@material-ui/core/colors/teal';
import countAdditionalDaysAbroad from '../utils/countAdditionalDaysAbroad'
import SimpleTable from '../elements/table';
import Calendar from '../calandar';
import Trip from '../elements/trip';
import countDaysAbroad from '../utils/countDaysAbroad';


const GridAlignSelfCenter = withStyles({
    item: {
        alignSelf: 'center'
    }
})(Grid);

const CustomDialogActions = withStyles({
    root: {
        justifyContent: 'space-around'
    }
})(DialogActions);

const tripDataInitial = {
    startDate: moment(Date.now()).format('YYYY-MM-DD').toString(),
    endDate: moment(Date.now()).format('YYYY-MM-DD').toString(),
    comment: ''
};

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.authUser.uid,
            tripData: tripDataInitial,
            tripState: '',
            tripActionUid: '',
            tripError: '',
            edgeDate: moment(new Date()).startOf('day').subtract(179, 'days').format('DD MMM YYYY').toString(),
            data: JSON.parse(localStorage.getItem('authUser')),
            tripsTabelHeads: ['', 'Start', 'End', 'Duration', 'Comment'],
            removeDialog: false,
            countAhead: '',
            countAheadDate: '',
            countAheadCross: '',
            countAheadEdgeDate: '',
            countAheadAdditionalDays: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.processTrip = this.processTrip.bind(this);
        this.handleTripAction = this.handleTripAction.bind(this);
        this.closeTripForm = this.closeTripForm.bind(this);
        this.validateTrip = this.validateTrip.bind(this);
        this.handleRemoveAgree = this.handleRemoveAgree.bind(this);
        this.handleRemoveDisagree = this.handleRemoveDisagree.bind(this);
        this.countAhead = this.countAhead.bind(this);
        this.handleCountAheadInputChange = this.handleCountAheadInputChange.bind(this);
        //this.countAdditionalDaysAbroad = this.countAdditionalDaysAbroad.bind(this);
    }

    componentDidMount() {
        this.ref = this.props.firebase.user(this.state.uid);
        this.ref.on('value', snapshot => {
            this.setState({ data: snapshot.val() })
        })
    }

    //reaction to button click on add/edit trip form
    processTrip() {
        let error = '';
        moment(this.state.tripData.endDate).diff(this.state.tripData.startDate, 'days') < 0 && (error = 'Trip starts after end date');
        moment(this.state.tripData.endDate).diff(this.state.tripData.startDate, 'days') >= 90 && (error = 'Trip is too long');
        let validate = this.validateTrip();
        validate && (error = validate);
        if (!error && this.state.tripState === 'add') {
            this.props.firebase.addTrip(this.state.uid, {
                startdate: this.state.tripData.startDate,
                enddate: this.state.tripData.endDate,
                duration: moment(this.state.tripData.endDate).diff(this.state.tripData.startDate, 'days') + 1,
                comment: this.state.tripData.comment || ''
            });
            this.closeTripForm();
        }
        if (!error && this.state.tripState === 'edit') {
            this.props.firebase.editTrip(this.state.uid, this.state.tripActionUid, {
                startdate: this.state.tripData.startDate,
                enddate: this.state.tripData.endDate,
                duration: moment(this.state.tripData.endDate).diff(this.state.tripData.startDate, 'days') + 1,
                comment: this.state.tripData.comment || ''
            });
            this.closeTripForm();
        }
        this.setState({ tripError: error });

        //console.log(this.state.tripState);
    }

    validateTrip() {
        //we need to check that current trip do not cross already existing ones
        const { trips } = this.state.data;
        for (let trip in this.state.data.trips) {
            if (moment(this.state.tripData.startDate).isBetween(moment(trips[trip].startdate), moment(trips[trip].enddate), null, '[]') ||
                moment(this.state.tripData.endDate).isBetween(moment(trips[trip].startdate), moment(trips[trip].enddate), null, '[]')) {
                if (this.state.tripActionUid !== trip) {
                    return `Trip dates everlap this one: ${ trips[trip].startdate } - ${ trips[trip].enddate } `
                }
            }
        }
        let daysAbroad = countDaysAbroad(this.state.data.trips, this.state.tripData.endDate);
        this.setState({ countAheadEdgeDate: moment(this.state.tripData.endDate).subtract(179, 'days').format('DD MMM YYYY') });
        daysAbroad += Number.parseInt(moment(this.state.tripData.endDate).diff(this.state.tripData.startDate, 'days') + 1);
        if (this.state.tripState === 'edit') {
            daysAbroad -= Number.parseInt(moment(this.state.data.trips[this.state.tripActionUid].enddate).diff(this.state.data.trips[this.state.tripActionUid].startdate, 'days') + 1);
        }
        if (daysAbroad > 90) {
            return `${ daysAbroad } days abroad will be on ${ moment(this.state.tripData.endDate).format('DD MMM YYYY') }. 
            Edge date for trip: ${ moment(this.state.tripData.endDate).subtract(179, 'days').format('DD MMM YYYY') }`
        }
        return '';
    }

    handleCountAheadInputChange(e) {
        this.setState({ countAheadDate: e.target.value, countAhead: '', countAheadCross: '' });
    }

    countAhead() {
        if (this.state.countAheadDate) {
            const days = countDaysAbroad(this.state.data.trips, this.state.countAheadDate);
            this.setState({ countAheadEdgeDate: moment(this.state.countAheadDate).subtract(179, 'days').format('DD MMM YYYY') });
            const additionalDays = countAdditionalDaysAbroad(90 - days, this.state.countAheadDate, this.state.data.trips);
            this.setState({ countAhead: days, countAheadAdditionalDays: additionalDays });
        }
    }

    handleTripAction(state, uuid = '') {
        this.setState({ tripState: state, tripActionUid: uuid });
        if (state === 'edit') {
            this.setState({
                tripData: {
                    startDate: moment(this.state.data.trips[uuid].startdate).format('YYYY-MM-DD'),
                    endDate: moment(this.state.data.trips[uuid].enddate).format('YYYY-MM-DD'),
                    comment: this.state.data.trips[uuid].comment
                }
            })
        }
        if (state === 'remove') {
            this.setState({
                removeDialog: true,
                tripActionUid: uuid
            })
        }
    }

    closeTripForm() {
        if (this.state.tripState === 'edit' || this.state.tripState === 'add') {
            this.setState({ tripData: tripDataInitial });
        }
        this.setState({ tripState: '', tripError: '' })
    }

    handleInputChange(e) {
        this.setState({ [e.target.name]: { ...this.state[e.target.name], [e.target.id]: e.target.value } })
    }

    componentWillUnmount() {
        this.ref.off();
    }

    handleRemoveAgree() {
        this.ref.child(`trips/${ this.state.tripActionUid }`).remove();
        this.setState({ tripData: tripDataInitial, tripState: '', tripError: '', tripActionUid: '' });
        this.setState({ removeDialog: false })
    }

    handleRemoveDisagree() {
        this.setState({ removeDialog: false })
    }

    render() {
        const daysAbroad = countDaysAbroad(this.state.data.trips);
        const additionalDays = countAdditionalDaysAbroad(90 - daysAbroad, moment(new Date()).startOf('day'), this.state.data.trips);
        return (
            <div>
                <Grid container spacing={ 32 }>
                    <Grid item md={ 6 }>
                        <Typography variant='body2'>
                            Data for { moment().format('DD MMM YYYY').toString() } (today):
                        </Typography>
                        { daysAbroad == null ?
                            <Typography variant="title" color="primary">
                                <p>No trips recorded yet</p>
                            </Typography>
                            :
                            (
                                !daysAbroad
                                    ?
                                    <p><CircularProgress/></p>
                                    :
                                    <span>
                                            <Typography variant="title" color="primary">
                                                { daysAbroad } { daysAbroad % 10 === 1 ? 'days spent' : 'days spent' }
                                            </Typography>
                                            <Typography variant="title" color="secondary">
                                                { 90 - daysAbroad }{ daysAbroad % 10 === 1 ? ' days left' : ' days left' }
                                            </Typography>
                                            <Typography variant="title" style={ { color: teal[800] } }>
                                                { 90 - daysAbroad + additionalDays }
                                                { (90 - daysAbroad + additionalDays) % 10 === 1 ? ' days allowed' : ' days allowed' }
                                            </Typography>
                                            <Typography color="error">
                                                Edge date: { this.state.edgeDate }
                                            </Typography>

                                        </span>
                            )
                        }
                    </Grid>
                    <Grid container item md={ 12 }>
                        <Grid item sm={ 4 } xs={ 7 } md={ 2 }>
                            <Typography variant='body2'>Count to exact date</Typography>
                            <TextField type="date" onChange={ this.handleCountAheadInputChange }
                                       defaultValue={ moment(Date.now()).format('YYYY-MM-DD').toString() }/>
                        </Grid>
                        <GridAlignSelfCenter item sm={ 3 } xs={ 5 } md={ 2 }>
                            { this.state.countAhead ?
                                <span>
                                <Typography variant="title" color="primary">
                                    { this.state.countAhead }
                                    { this.state.countAhead % 10 === 1 && this.state.countAhead !== 11 ? ' day spent' : ' days spent' }
                                </Typography>
                                <Typography variant="title" color="secondary">
                                    { 90 - this.state.countAhead }
                                    { this.state.countAhead % 10 === 1 && this.state.countAhead !== 11 ? ' day left' : ' days left' }
                                </Typography>
                                     <Typography variant="title" style={ { color: teal[800] } }>
                                                { 90 - this.state.countAhead + this.state.countAheadAdditionalDays }
                                                { (90 - this.state.countAhead + this.state.countAheadAdditionalDays) % 10 === 1 ? ' days allowed' : ' days allowed' }
                                            </Typography>
                                    { this.state.countAheadCross ? null : <Typography color='error'>Edge
                                        date: { this.state.countAheadEdgeDate }</Typography> }

                                </span>
                                :
                                <Button onClick={ this.countAhead } variant="contained" color="secondary">Count</Button>
                            }
                        </GridAlignSelfCenter>
                        { this.state.countAheadCross ?
                            <GridAlignSelfCenter item sm={ 5 } xs={ 12 } md={ 4 }>
                                <Typography color="error">
                                    Your date - 180 days crosses period in the table:<br/>
                                    { this.state.countAheadCross }<br/>
                                    Edge date is: { this.state.countAheadEdgeDate }
                                </Typography>
                            </GridAlignSelfCenter>
                            : null

                        }
                    </Grid>
                </Grid>

                <Calendar/>

                {/*Table with trips records*/ }
                <SimpleTable handler={ this.handleTripAction }
                             data={ this.state.data.trips }
                             heads={ this.state.tripsTabelHeads }
                />
                { this.state.tripState === 'edit' || this.state.tripState === 'add' ?
                    <ClickAwayListener onClickAway={ this.closeTripForm }>
                        <Trip
                            legend={ this.state.tripState === 'add' ? 'Add new trip' : 'Edit trip' }
                            button={ this.state.tripState === 'add' ? 'Add' : 'Save' }
                            action={ this.processTrip }
                            handleInputChange={ this.handleInputChange }
                            cancel={ this.closeTripForm }
                            error={ this.state.tripError }
                            enddate={ this.state.tripData.endDate }
                            startdate={ this.state.tripData.startDate }
                            comment={ this.state.tripData.comment }
                        />
                    </ClickAwayListener>
                    : null
                }

                {/*Dialog about trip*/ }
                <Dialog open={ this.state.removeDialog }>
                    <DialogTitle>Are you sure you want to delete trip record?</DialogTitle>
                    <DialogContent>
                        { this.state.tripActionUid ?
                            <DialogContentText>
                                <Typography>
                                    <b>Start
                                        date:</b> { moment(this.state.data.trips[this.state.tripActionUid].startdate).format('DD MMMM YYYY') }
                                </Typography>
                                <Typography>
                                    <b>End
                                        date:</b> { moment(this.state.data.trips[this.state.tripActionUid].enddate).format('DD MMMM YYYY') }
                                </Typography>
                            </DialogContentText>
                            : null
                        }
                    </DialogContent>
                    <CustomDialogActions classes={ { root: { justifyContent: 'space-around' } } }>
                        <Button color="primary" onClick={ this.handleRemoveAgree }>Yes</Button>
                        <Button color="secondary" onClick={ this.handleRemoveDisagree }>No</Button>
                    </CustomDialogActions>
                </Dialog>
            </div>

        )
    }
}

const condition = authUser => !!authUser;

export default compose(withEmailVerification, withAuthorization(condition),
    withFirebase)(HomePage);