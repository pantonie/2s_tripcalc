import React from 'react';
import preval from 'preval.macro';
import moment from 'moment';
import styles from './footer.module.css'

const buildDate = preval`
module.exports = new Date()
`;
const Footer = () => (
    <footer className={styles.footer}>
        Build: { moment(buildDate).format('DD MMM YYYY HH:mm:ss') }
    </footer>
);

export default Footer;