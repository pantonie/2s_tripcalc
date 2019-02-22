import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './logo.module.css';
import favicon from '../../assets/favicon.ico';

const Logo = () => (
/*'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2', 'caption', 'button', 'overline', 'srOnly', 'inherit', "display4", 'display3', 'display2', 'display1', 'headline', 'title', 'subheading'*/
    <div>
        <Typography variant="button" component="div" className={styles.logoContainer}>
            <Avatar alt="logo" src={favicon} className={styles.icon}/>
            Travel calculator
        </Typography>
    </div>
);

export default Logo