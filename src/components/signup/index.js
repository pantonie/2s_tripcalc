/*eslint-disable no-unused-expressions*/
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styles from './signup.module.css';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withFirebase } from '../firebase';
import { withRouter } from 'react-router-dom';
import * as Routes from '../../constants/routes';
import { compose } from 'recompose'

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${ theme.palette.divider }`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={ classes.root }>
            <Typography variant="h6">{ children }</Typography>
            { onClose ? (
                <IconButton aria-label="Close" className={ classes.closeButton } onClick={ onClose }>
                    <CloseIcon/>
                </IconButton>
            ) : null }
        </MuiDialogTitle>
    );
});
const INITIAL_STATE = {
    open: false,
    maxWidth: 'xs',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password1: '',
    error: ''
};

export class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
        this.clearForm = this.clearForm.bind(this);
    }
    clearForm() {
        this.setState({...INITIAL_STATE, open: true});
    }
    handleClickOpen = () => {
        this.setState({ open: true })
    };
    handleClose = () => {
        this.setState({ open: false });
        this.setState({ error: '' });
    };
    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })

    };

    validateForm = () => {
        let error = '';
        this.state.password.length < 8 ? error = 'Password must contain at least 8 symbols' : null;
        this.state.password !== this.state.password1 ? error = 'Passwords are not the same' : null;
        !this.state.password1 ? error = '"Confirm Password" must not be empty' : null;
        !this.state.password ? error = 'Password must not be empty' : null;
        !/^\S+@\S+\.\S+$/.test(this.state.email) ? error = 'Email has wrong format' : null;
        !this.state.email ? error = 'Wrong email' : null;
        !this.state.lastname ? error = 'Lastname must not be empty' : null;
        !this.state.firstname ? error = 'Name must not be empty' : null;
        this.setState({ error });
        if (error) return false;
        return true;
    };

    onSubmit = () => {
        if (!this.validateForm()) return null;
        const { firstname, lastname, email } = this.state;
        this.props.firebase.createUserWithEmailAndPassword(this.state.email, this.state.password)
            .catch(error => {
                this.setState({ error: error.message })
            })
            .then(authUser => {
                return this.props.firebase.user(authUser.user.uid)
                    .set({
                        email,
                        date: Date.now(),
                        trips: '',
                        passports: '',
                        policies: '',
                        info: {
                            firstname,
                            lastname
                        }
                    });
            })
            .then(() => {
                return this.props.firebase.sendEmailVerification();
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.openSnack('Please check your mailbox!');
                this.props.history.push(Routes.HOME);
            })
            .catch(error => {
                console.log(error);
                this.props.firebase.throwError({
                    date: Date.now(),
                    email: email,
                    error: error.message
                });
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(Routes.HOME);
            })
    };

    render() {
        return (
            <div>
                <Button variant="contained" color="primary" onClick={ this.handleClickOpen }>
                    Sign Up
                </Button>
                <Dialog
                    open={ this.state.open }
                    onClose={ this.handleClose }
                    fullWidth
                    maxWidth={ this.state.maxWidth }
                >
                    <DialogTitle onClose={ this.handleClose }>
                        Sign Up
                    </DialogTitle>

                    <DialogContent>

                        <form className={ styles.signUpForm }>
                            <TextField
                                required
                                name="firstname"
                                id="firstname"
                                label="Name"
                                margin="normal"
                                variant="outlined"
                                autoFocus
                                value={ this.state.firstname }
                                onChange={ this.handleInputChange }
                            />
                            <TextField
                                required
                                name="lastname"
                                id="lastname"
                                label="Lastname"
                                margin="normal"
                                variant="outlined"
                                value={ this.state.lastname }
                                onChange={ this.handleInputChange }
                            />
                            <TextField
                                required
                                name="email"
                                id="email"
                                label="Email"
                                margin="normal"
                                variant="outlined"
                                value={ this.state.email }
                                onChange={ this.handleInputChange }
                            />
                            <TextField
                                required
                                error={ !!(this.state.password.length < 8) && !!(this.state.password.length > 0) }
                                name="password"
                                id="password"
                                label="password"
                                type="password"
                                margin="normal"
                                variant="outlined"
                                value={this.state.password}
                                onChange={ this.handleInputChange }
                            />
                            <TextField
                                required
                                error={ !!(this.state.password1.length < 8) && !!(this.state.password1.length > 0) }
                                name="password1"
                                id="password1"
                                label="confirm password"
                                type="password"
                                margin="normal"
                                variant="outlined"
                                value={this.state.password1}
                                onChange={ this.handleInputChange }
                            />
                            { this.state.error &&
                            <Typography color="error" variant="h6">
                                { this.state.error }
                            </Typography>
                            }
                        </form>
                        <div className={ styles.buttons }>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={ this.onSubmit }>
                                Sign up
                            </Button>
                            <Button size="large" onClick={this.clearForm}>
                                Clear
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }
}

export default compose(withFirebase, withRouter)(SignUp);