import React from 'react';
import { withFirebase } from '../firebase'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import styles from './pwreset.module.css';
import { withRouter } from "react-router-dom";
import { compose } from 'recompose';
import * as Routes from '../../constants/routes'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

class PwReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            error: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.handleResetClick = this.handleResetClick.bind(this);
    }

    handleInputChange(e) {
        this.setState({ email: e.target.value, error: '' });
    };

    handleBackClick() {
        this.props.history.push(Routes.HOME);
    }

    handleResetClick() {
        if (!/^\S+@\S+\.\S+$/.test(this.state.email)) {
            this.setState({ error: 'Email has wrong format' });
            return;
        }
        this.props.firebase.passwordReset(this.state.email);
        this.props.openSnack('Please check your mailbox!');
        this.props.history.push(Routes.HOME);

    }

    render() {
        return (
            <Grid container justify="center" alignItems="center">
            <Paper>
                <form className={ styles.resetForm }>
                    <Typography>To reset password type your email address and click Reset button</Typography>
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
                    <Typography color="error" variant="h6">
                        { this.state.error }
                    </Typography>
                    <div className={ styles.buttonsContainer }>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={ this.handleResetClick }
                        >
                            Reset
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            onClick={ this.handleBackClick }
                        >
                            Back
                        </Button>
                    </div>
                </form>

            </Paper>
            </Grid>
        )
    }
}


export default compose(withFirebase, withRouter)(PwReset);