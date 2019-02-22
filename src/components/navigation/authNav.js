import React from 'react';
import Logout from '../logout';
import Typography from '@material-ui/core/Typography'
import { AuthUserContext } from '../session';
import AccountCircle from '@material-ui/icons/AccountCircle'
import styles from './authNav.module.css';
import IconButton from '@material-ui/core/IconButton';


class AuthNav extends React.Component {
    render() {
        const { info: { firstname } } = this.context;
        return (
            <div className={ styles.navigation }>
                <div>
                    <IconButton color='inherit'>
                        <AccountCircle/>
                    </IconButton>
                    <Typography
                        variant='button'
                        inline
                        color='inherit'
                    >
                        Hello { firstname }
                    </Typography>
                </div>
                <Logout/>
            </div>
        )
    }
}

AuthNav.contextType = AuthUserContext;

export default AuthNav;