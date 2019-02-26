import countAdditionalDaysAbroad from './countAdditionalDaysAbroad';
import moment from 'moment';

const today = moment(new Date()).startOf('day');

/*trip starts on the edge date so trip length should be  return*/
const trips1 = {
    123: {
        startdate: moment(today).subtract(179, 'days').format('YYYY-MM-DD'),
        enddate: moment(today).subtract(170, 'days').format('YYYY-MM-DD')
    }
};

it('counts additional days if trip started at edge date', () => {
    expect(countAdditionalDaysAbroad(80, today, trips1)).toEqual(10);
});

/*Trip started somewhere in the middle of 180 days period*/
const trips2 = {
    123: {
        startdate: moment(today).subtract(169, 'days').format('YYYY-MM-DD'),
        enddate: moment(today).subtract(160, 'days').format('YYYY-MM-DD')
    }
};

it('counts additional days if trip started in the middle of 180 days period', () => {
    expect(countAdditionalDaysAbroad(80, today, trips2)).toEqual(10);
});

/*Trip started before 180 days period*/
const trips3 = {
    123: {
        startdate: moment(today).subtract(185, 'days').format('YYYY-MM-DD'),
        enddate: moment(today).subtract(175, 'days').format('YYYY-MM-DD')
    }
};

it('counts additional days if trip started before 180 days period', () => {
    expect(countAdditionalDaysAbroad(85, today, trips3)).toEqual(5);
});