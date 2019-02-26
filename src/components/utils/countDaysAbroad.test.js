import countDaysAbroad from './countDaysAbroad';
import moment from 'moment';

const today = moment(new Date()).startOf('day');

const trips1 = {
    123: {
        startdate: moment(today).subtract(179, 'days'),
        enddate: moment(today).subtract(170, 'days'),
        duration: 10
    }
};

const trips2 = {
    123: {
        startdate: moment(today).subtract(179, 'days'),
        enddate: moment(today).subtract(90, 'days'),
        duration: 90
    }
};

const trips3 = {
    123: {
        startdate: moment(today).subtract(179, 'days'),
        enddate: moment(today).subtract(135, 'days'),
        duration: 45
    },
    345: {
        startdate: moment(today).subtract(44, 'days'),
        enddate: today,
        duration: 45
    }

};

it('count number of days spent abroad', () => {
    expect(countDaysAbroad(trips1)).toEqual(10);
    expect(countDaysAbroad(trips2)).toEqual(90);
    expect(countDaysAbroad(trips3)).toEqual(90);
});