import app from 'firebase/app';
import 'firebase/auth';
import  'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUSKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
    };

    //--------AUTH API-------------------
    createUserWithEmailAndPassword = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    signInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
    signOut = () => this.auth.signOut();
    passwordReset = (email) => this.auth.sendPasswordResetEmail(email);
    passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

    //-------------USER API----------------
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');
    throwError = (err) => this.db.ref().child('errors').push(err);
    sendEmailVerification = () => this.auth.currentUser.sendEmailVerification({ url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT });
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();

                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            emailVerified: authUser.emailVerified,
                            providerData: authUser.providerData,
                            ...dbUser
                        };
                        next(authUser);
                    })
            } else {
                fallback();
            }
        })

}

export default Firebase;