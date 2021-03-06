import moment from 'moment';
/**
 * This returns additional days that could be added to days left
 * @param {number} days - number of days left from 90 days period
 * @param {string} date - end of 180 days period, could be future date
 * @param {object} trips - object with trips records
 * @returns {number} daysLeft - number of days which can be added to left days
 * **/

const countAdditionalDaysAbroad = (days, date, trips) => {
    const today = moment(date);
    const edgeDate = moment(today).subtract(179, 'days');
    let cutDate =  edgeDate;
    let daysLeft = days;
    let additionalDays = 0;
    const rows = Object.keys(trips).map(key => {
        return { ...trips[key] }
    });
    rows.sort((a, b) => (a.startdate < b.startdate ? -1 : 1));
    for (let i=0; i<rows.length; i++){
        if (moment(rows[i].startdate).isBetween(edgeDate, today, null, '(]') && moment(rows[i].enddate).isBetween(edgeDate, today, null, '[]')) {
            if ((moment(cutDate).diff(rows[i].startdate, 'days') + 1) < daysLeft) {
                daysLeft -= Number.parseInt(moment(rows[i].startdate).diff(cutDate, 'days'));
                if (daysLeft <= 0) {
                    return additionalDays;
                }
                additionalDays += Number.parseInt(moment(rows[i].enddate).diff(rows[i].startdate, 'days') + 1);
                cutDate = moment(rows[i].enddate).add(1, 'day');
            }
        }
        if  (moment(rows[i].startdate).isSameOrBefore(edgeDate) && moment(rows[i].enddate).isSameOrAfter(edgeDate)) {
            additionalDays += Number.parseInt(moment(rows[i].enddate).diff(edgeDate, 'days') + 1);
        }
    }
    return additionalDays;
};

export default countAdditionalDaysAbroad;