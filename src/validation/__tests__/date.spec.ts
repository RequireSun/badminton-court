import date from '../date';

describe('test case for validation/date', () => {
    test('months coverage', () => {
        expect(date('2019-01-31')).toEqual(true);
        expect(date('2019-01-32')).toEqual(false);
        expect(date('2019-02-28')).toEqual(true);
        expect(date('2019-02-29')).toEqual(false);
        expect(date('2019-03-31')).toEqual(true);
        expect(date('2019-03-32')).toEqual(false);
        expect(date('2019-04-30')).toEqual(true);
        expect(date('2019-04-31')).toEqual(false);
        expect(date('2019-05-31')).toEqual(true);
        expect(date('2019-05-32')).toEqual(false);
        expect(date('2019-06-30')).toEqual(true);
        expect(date('2019-06-31')).toEqual(false);
        expect(date('2019-07-31')).toEqual(true);
        expect(date('2019-07-32')).toEqual(false);
        expect(date('2019-08-31')).toEqual(true);
        expect(date('2019-08-32')).toEqual(false);
        expect(date('2019-09-30')).toEqual(true);
        expect(date('2019-09-31')).toEqual(false);
        expect(date('2019-10-31')).toEqual(true);
        expect(date('2019-10-32')).toEqual(false);
        expect(date('2019-11-30')).toEqual(true);
        expect(date('2019-11-31')).toEqual(false);
        expect(date('2019-12-31')).toEqual(true);
        expect(date('2019-12-32')).toEqual(false);

        expect(date('1900-02-29')).toEqual(false);
        expect(date('1900-02-00')).toEqual(false);
        expect(date('2001-13-01')).toEqual(false);
        expect(date('1900/02/00')).toEqual(false);
    });
});
