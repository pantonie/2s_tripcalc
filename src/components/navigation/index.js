import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import AuthNav from './authNav';
import { AuthUserContext } from '../session';
import Logo from '../elements/logo';

const Navigation = () => (
    <div>
        <AppBar position="static">
            <Toolbar>
                <AuthUserContext.Consumer>
                    { authUser => authUser ? <AuthNav/> : <Logo/> }
                </AuthUserContext.Consumer>
            </Toolbar>
        </AppBar>
    </div>
);

export default Navigation;