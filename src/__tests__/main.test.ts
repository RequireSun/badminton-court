import Main from '../main';

test('normal use', () => {
    const testCase = [
        'U002 2017-08-01 19:00~22:00 A',
        'U003 2017-08-01 18:00~20:00 A',
        'U002 2017-08-01 19:00~22:00 A C',
        'U002 2017-08-01 19:00~22:00 A C',
        'U003 2017-08-01 18:00~20:00 A',
        'U003 2017-08-02 13:00~17:00 B',
    ];

    const main = new Main();

    for (let i = 0, l = testCase.length; i < l; ++i) {
        main.input(testCase[i]);
    }

    const result = main.output();

    expect(result).toMatchObject({
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
