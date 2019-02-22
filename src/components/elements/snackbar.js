import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';



export default class SnackBar extends React.Component {
    render() {
        return (
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    TransitionComponent={(props) => <Slide {...props} direction='down'/>}
                    open={this.props.open}
                    onClose={this.props.handleClose}
                    message={this.props.message}
                    autoHideDuration={20000}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="inherit"
                            onClick={this.props.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />

        )
    }
}