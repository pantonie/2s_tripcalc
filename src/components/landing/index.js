import React from 'react';
import SignUp from '../signup';
import { withRouter } from 'react-router-dom';
import * as Routes from '../../constants/routes';
import Login from "../login";
import Grid from '@material-ui/core/Grid';

class LandingPage extends React.Component {
    componentDidMount() {
        if (localStorage.getItem('authUser')) {
            this.props.history.push(Routes.HOME);
        }
    }

    render() {
        return (
            <Grid
                container
                justify="center"
            >
            <Login>
                <SignUp openSnack={ this.props.openSnack }/>
            </Login>
            </Grid>
        )
    }
}

export default withRouter(LandingPage);