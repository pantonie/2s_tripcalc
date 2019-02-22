import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper'
import styles from './login.module.css';
import { withFirebase } from '../firebase';
import Typography from '@material-ui/core/Typography';
import * as Routes from '../../constants/routes';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import Divider from '@material-ui/core/Divider';



const INITIAL_STATE = {
    open: false,
    email: '',
    password: '',
    error: ''
};

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }

    handleInputChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };
    handleClose = (e) => {
        this.setState({ error: '' });
        e.type !== 'keydown' && this.setState({ open: false });
    };
    onLogin = () => {
        this.setState({ error: '' });
        this.state.password.length < 8 && this.setState({ error: 'password' });
        !/^\S+@\S+\.\S+$/.test(this.state.email) && this.setState({ error: 'email' });
        if (this.state.error) return;
        this.props.firebase.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                this.setState(INITIAL_STATE);
                this.props.history.push(Routes.HOME);
            })
            .catch(error => {
                this.setState({ error: error.message });
            })
    };

    render() {
        return (
            <Paper component="div" className={styles.container}>
                <form id="login-form" className={ styles.loginForm } autoComplete="off">
                    <TextField
                        required
                        name="email"
                        id="email"
                        label="Email"
                        margin="normal"
                        variant="outlined"
                        error={ this.state.error === 'email' }
                        value={ this.state.email }
                        onChange={ this.handleInputChange }
                    />
                    <TextField
                        required
                        name="password"
                        id="password"
                        label="password"
                        type="password"
                        margin="normal"
                        variant="outlined"
                        error={ this.state.error === 'password' }
                        onChange={ this.handleInputChange }
                    />
                    {
                        this.state.error !== 'email' && this.state.error !== 'password' &&
                        <Typography color="error" variant="h6">
                            { this.state.error }
                        </Typography>
                    }
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={ this.onLogin }
                        fullWidth={ false }
                        className={ styles.buttonLogin }>
                        Login
                    </Button>
                    {/*<Divider variant="middle" className={ styles.divider }/>*/}
                    <Typography>
                        <Link to="/pw-reset" onClick={ this.handleClose }>Reset password</Link>
                    </Typography>
                    <Divider variant="middle" className={ styles.divider }/>
                    {this.props.children}
                </form>

            </Paper>
        )
    }
}


export default compose(withFirebase, withRouter)(Login);