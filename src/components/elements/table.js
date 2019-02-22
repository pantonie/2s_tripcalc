import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles'
import styles from './table.module.css';
import Checkbox from '@material-ui/core/Checkbox';
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Add from '@material-ui/icons/Add';
import moment from 'moment';

const TableHeadCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        paddingLeft: '5px',
        paddingRight: '5px'
    }
}))(TableCell);
const TablePaddingCell = withStyles(() => ({
    paddingDense: {
        paddingLeft: '5px',
        paddingRight: '5px'
    },
    root: {
        '&:last-child': {
            paddingLeft: '5px',
            paddingRight: '5px'
        }
    }
}))(TableCell);

class SimpleTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uuid: ''
        }
    }

    handleCheckboxClick = (uuid) => {

        this.state.uuid === uuid ? this.setState({ uuid: '' }) : this.setState({ uuid })
    };

    handleButtonClick(action) {
        this.props.handler(action, this.state.uuid);
        this.setState({ uuid: '' });

    }

    render() {
        let rows= [{
            startdate: 'startdate',
            enddate: 'enddate',
            comment: 'Some trip details',
            duration: '999 days'
        }];
        if (!!this.props.data){
            rows = Object.keys(this.props.data).map(key => {
                return { uid: key, ...this.props.data[key] }
            });
        }
        return (
            <Paper className={ styles.table }>
                <Table>
                    <TableHead>
                        <TableRow>
                            { this.props.heads.map(head => <TableHeadCell align='center'
                                                                          key={ head }>{ head }</TableHeadCell>) }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { rows.sort((a, b) => (a.startdate < b.startdate ? 1 : -1)).map(row => (
                            <TableRow key={ row.uid }>
                                <TableCell padding='none' className={ styles.checkbox }>
                                    <Checkbox
                                        onClick={ () => this.handleCheckboxClick(row.uid) }
                                        checked={ this.state.uuid === row.uid }
                                    />
                                </TableCell>
                                <TablePaddingCell padding='dense' align='center'>{ moment(row.startdate).format('DD-MM-YYYY') }</TablePaddingCell>
                                <TablePaddingCell padding='dense' align='center'>{ moment(row.enddate).format('DD-MM-YYYY') }</TablePaddingCell>
                                <TablePaddingCell padding='dense'
                                                  align='center'>{ row.duration }{ row.duration % 10 === 1 && row.duration !== 11 ? ' day' : ' days' }</TablePaddingCell>
                                <TablePaddingCell padding='dense' align='center'>{ row.comment }</TablePaddingCell>
                            </TableRow>
                        )) }
                        <TableRow>
                            <TableCell padding='none' variant='footer' align='center'
                                       colSpan={ this.props.heads.length - 1 }>
                                <Button color='primary' disabled={ !this.state.uuid }
                                        onClick={ () => this.handleButtonClick('remove') }>
                                    <Delete/>
                                </Button>
                                <Button color='secondary' disabled={ !this.state.uuid }
                                        onClick={ () => this.handleButtonClick('edit') }>
                                    <Edit/>
                                </Button>
                            </TableCell>
                            <TableCell align='left' padding='none'>
                                <Button color='primary' variant='contained' disabled={ !!this.state.uuid }
                                        onClick={ () => this.handleButtonClick('add') }>
                                    <Add/>
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

export default SimpleTable;
