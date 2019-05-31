import Main from '../main';

describe('official cases', () => {
    const inNout = (testCase: string[]) => {
        const main = new Main();

        for (let i = 0, l = testCase.length; i < l; ++i) {
            main.input(testCase[i]);
        }

        return main.output();
    };

    test('case 1', () => {
        const testCase = [
            'abcdefghijklmnopqrst1234567890',
            'U001 2016-06-02 22:00~22:00 A',
            'U002 2017-08-01 19:00~22:00 A',
            'U003 2017-08-02 13:00~17:00 B',
            'U004 2017-08-03 15:00~16:00 C',
            'U005 2017-08-05 09:00~11:00 D',
        ];

        expect(inNout(testCase)).toMatchObject({
            A: {
                bookings: [{
                    booking: {
                        userName: 'U002',
                        date: '2017-08-01',
                        startTime: 68400000,
                        endTime: 79200000,
                        courtNo: 'A',
                        status: 'Booked'
                    }, price: 200
                }], price: 200
            },
            B: {
                bookings: [{
                    booking: {
                        userName: 'U003',
                        date: '2017-08-02',
                        startTime: 46800000,
                        endTime: 61200000,
                        courtNo: 'B',
                        status: 'Booked'
                    }, price: 200
                }], price: 200
            },
            C: {
                bookings: [{
                    booking: {
                        userName: 'U004',
                        date: '2017-08-03',
                        startTime: 54000000,
                        endTime: 57600000,
                        courtNo: 'C',
                        status: 'Booked'
                    }, price: 50
                }], price: 50
            },
            D: {
                bookings: [{
                    booking: {
                        userName: 'U005',
                        date: '2017-08-05',
                        startTime: 32400000,
                        endTime: 39600000,
                        courtNo: 'D',
                        status: 'Booked'
                    }, price: 80
                }], price: 80
            }
        });
    });

    test('case 2', () => {
        const testCase = [
            'U002 2017-08-01 19:00~22:00 A',
            'U003 2017-08-01 18:00~20:00 A',
            'U002 2017-08-01 19:00~22:00 A C',
            'U002 2017-08-01 19:00~22:00 A C',
            'U003 2017-08-01 18:00~20:00 A',
            'U003 2017-08-02 13:00~17:00 B',
        ];

        expect(inNout(testCase)).toMatchObject({
            A: {
                bookings: [
                    {
                        booking: {
                            userName: 'U003',
                            date: '2017-08-01',
                            startTime: 64800000,
                            endTime: 72000000,
                            courtNo: 'A',
                            status: 'Booked',
                        },
                        price: 160,
                    },
                    {
                        booking: {
                            userName: 'U002',
                            date: '2017-08-01',
                            startTime: 68400000,
                            endTime: 79200000,
                            courtNo: 'A',
                            status: 'Canceled',
                        },
                        price: 100,
                    },
                ],
                price: 260,
            },
            B: {
                bookings: [
                    {
                        booking: {
                            userName: 'U003',
                            date: '2017-08-02',
                            startTime: 46800000,
                            endTime: 61200000,
                            courtNo: 'B',
                            status: 'Booked',
                        },
                        price: 200,
                    },
                ],
                price: 200,
            },
        });
    });
});

// test('edge case of date', () => {
//     const testCase = [
//         'U002 2017-08-01 19:00~22:00 A',
//         'U003 2017-08-01 18:00~20:00 A',
//         'U002 2017-08-01 19:00~22:00 A C',
//         'U002 2017-08-01 19:00~22:00 A C',
//         'U003 2017-08-01 18:00~20:00 A',
//         'U003 2017-08-02 13:00~17:00 B',
//     ];
//
// });
