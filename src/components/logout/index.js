import React from 'react';
import Button from '@material-ui/core/Button'
import {withFirebase} from "../firebase";

class Logout extends React.Component {
    handleClick = () => {
        this.props.firebase.signOut();
    };

    render() {
        return (
            <Button
                color="inherit"
                onClick={this.handleClick}
                component='div'
            >
                Logout
            </Button>
        )
    }
}

export default withFirebase(Logout);