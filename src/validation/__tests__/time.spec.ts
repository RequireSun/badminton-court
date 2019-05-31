import time from '../time';

describe('test case for validation/time', () => {
    test('case 1', () => {
        expect(time('12:00', '2019-01-01')).toEqual(false);
        expect(time('12:00', '23:01')).toEqual(false);
        expect(time('12:00', '25:00')).toEqual(false);
    });
});
