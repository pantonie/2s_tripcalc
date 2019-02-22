import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../navigation';
import * as Routes from '../../constants/routes';
import LandingPage from '../landing';
import { withAuthentication } from '../session';
import HomePage from '../home';
import styles from './app.module.css';
import SnackBar from '../elements/snackbar';
import PwReset from '../pwreset'
import Footer from '../footer'


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authUser: null,
            snack: {
                message: 'test message from parents',
                open: false
            }
        };
    }

    handleSnackbarClose = () => {
        this.setState({ snack: { open: !this.state.snack.open } });
    };
    openSnackbar = (message) => {
        this.setState({ snack: { message: message, open: true } });
    };

    render() {
        return (
            <Router>
                <div>
                    <Navigation/>
                    <div className={ styles.content }>
                        <Route exact path={ Routes.LANDING }
                               render={ props => <LandingPage { ...props } openSnack={ this.openSnackbar }/> }/>
                        <Route path={ Routes.HOME } component={ HomePage }/>
                        <Route path={ Routes.PASSWORD_RESET }
                               render = {props => <PwReset {...props}  openSnack={ this.openSnackbar }/>}/>
                    </div>
                    <SnackBar open={ this.state.snack.open } message={ this.state.snack.message }
                              handleClose={ this.handleSnackbarClose } autoHideDuration={20000}/>
                    <Footer/>
                </div>
            </Router>

        )
    }
}

export default withAuthentication(App);