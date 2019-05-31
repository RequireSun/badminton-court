import sortFnDate from '../sortFnDate';

describe('test case for util/sortFnDate', () => {
    test('error status (never get in in normal status)', () => {
        expect(sortFnDate({
            booking: {
                userName: 'U001',
                date: '2019-01-01',
                startTime: 1,
                endTime: 2,
                courtNo: 'A',
                status: 'Booked',
            },
            price: 0,
        }, {
            booking: {
                userName: 'U001',
                date: '2019-01-01',
                startTime: 1,
                endTime: 1,
                courtNo: 'A',
                status: 'Booked',
            },
            price: 0,
        })).toEqual(1);
    });
});
