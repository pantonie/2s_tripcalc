import React from 'react';
import styles from './universalForm.module.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class UniversalForm extends React.Component {
     render() {
        return (
            <form className={ styles.form }>
                <fieldset className={ styles.fieldset }>
                    <legend className={ styles.legend }>{ this.props.legend }</legend>
                    { this.props.children }
                    { this.props.error ?
                        <Typography color="error" component="span" className={styles.error}>
                            {this.props.error}
                        </Typography>
                        : null
                    }
                    <div className={ styles.buttons }>

                        <Button
                            size='small'
                            variant='contained'
                            color='primary'
                            className={ styles.button }
                            onClick={ this.props.action }>
                            { this.props.button }
                        </Button>
                        <Button
                            size='small'
                            variant='contained'
                            color='secondary'
                            className={ styles.button }
                            onClick={ this.props.cancel }>
                            Cancel
                        </Button>
                    </div>
                </fieldset>
            </form>
        )
    }
}

export default UniversalForm;