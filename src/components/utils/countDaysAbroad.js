import moment from 'moment';

/**
 * This return how much days was spent abroad for the last 180 days period
 * @param {string} inputDate - the end of 180 days period. Could be future date.
 * @param {object} trips - Object contains trips records
 *@returns {number}
 * **/


const countDaysAbroad = (trips, inputDate) => {
    let today = null;
    inputDate ? today = moment(inputDate) : today = moment(new Date()).startOf('day');
    const edgeDate = moment(today).subtract(179, 'days');
    if (inputDate) {
        //this.setState({ countAheadEdgeDate: edgeDate.format('DD MMM YYYY') })
    }
    //const { trips } = this.state.data;
    if (!trips) {
        return 90;
    }

    let daysAbroad = 0;
    for (let trip in trips) {
        if (moment(trips[trip].startdate).isBetween(edgeDate, today, null, '[]') && moment(trips[trip].enddate).isBetween(edgeDate, today, null, '[]')) {
            daysAbroad += Number.parseInt(trips[trip].duration);
        }
        if (moment(trips[trip].startdate).isBefore(edgeDate) && moment(trips[trip].enddate).isSameOrAfter(edgeDate)) {
            daysAbroad += Number.parseInt(moment(trips[trip].enddate).diff(edgeDate, 'days') + 1);
            if (inputDate) {
                this.setState({
                    countAheadCross: moment(trips[trip].startdate).format('DD-MM-YYYY').toString() + ' - ' + moment(trips[trip].enddate).format('DD-MM-YYYY').toString(),
                })
            }
        }
        if (moment(trips[trip].startdate).isSameOrBefore(today) && moment(trips[trip].enddate).isAfter(today)) {
            daysAbroad += Number.parseInt(moment(today).diff(trips[trip].startdate, 'days') + 1);
        }
    }
    return daysAbroad;
};

export default countDaysAbroad;