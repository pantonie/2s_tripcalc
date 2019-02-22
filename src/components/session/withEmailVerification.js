import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../firebase';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const needsEmailVerification = authUser =>
    authUser && !authUser.emailVerified && authUser.providerData.map(provider => provider.providerId).includes('password');

const withEmailVerification = Component => {
    class WithEmailFerification extends React.Component {
        constructor(props) {
            super(props);

            this.state = { isSent: false };
        }

        sendEmailVerification = () => {
            this.props.firebase.sendEmailVerification().then(() => this.setState({ isSent: true }));
        };

        render() {
            return (
                <AuthUserContext.Consumer>
                    { authUser =>
                        needsEmailVerification(authUser) ? (
                            <div>
                                { this.state.isSent ? (
                                    <div>
                                        <Typography variant='title'>
                                            E-Mail confirmation sent
                                        </Typography>
                                        <br/>
                                        <Typography variant='body2' paragraph>
                                            Check your E-Mails (Spam
                                            folder included) for a confirmation E-Mail.
                                            Refresh this page once you confirmed your E-Mail.
                                        </Typography>
                                    </div>
                                ) : (
                                    <div>
                                        <Typography variant='title'>Verify your E-Mail </Typography>
                                        <br/>
                                        <Typography variant='body2' paragraph>
                                            Check your E-Mails (Spam folder
                                            included) for a confirmation E-Mail or send
                                            another confirmation E-Mail.
                                        </Typography>
                                        <br/>
                                    </div>
                                )
                                }
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={ this.sendEmailVerification }
                                    disabled={ this.state.isSent }
                                >
                                    Send confirmaion E-mail
                                </Button>

                            </div>
                        ) : <Component { ...this.props } />
                    }
                </AuthUserContext.Consumer>
            )
        }
    }

    return withFirebase(WithEmailFerification);
};

export default withEmailVerification;