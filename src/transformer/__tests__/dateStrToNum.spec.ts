import dateStrToNum from '../dateStrToNum';

describe('test case for transformer/dateStrToNum', () => {
    test('error status (never get in in normal status)', () => {
        // 这里要传函数, 否则运行到用例的地方当场就执行计算, 报错了
        expect(() => dateStrToNum('123132123')).toThrowError('input schema incorrect!');
    });
});
