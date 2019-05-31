import Main from './main';

const testCase = [
    'U002 2017-08-01 19:00~22:00 A',
    'U003 2017-08-01 18:00~20:00 A',
    'U002 2017-08-01 19:00~22:00 A C',
    'U002 2017-08-01 19:00~22:00 A C',
    'U003 2017-08-01 18:00~20:00 A',
    'U003 2017-08-02 13:00~17:00 B',
];

(() => {
    const main = new Main();

    for (let i = 0, l = testCase.length; i < l; ++i) {
        main.input(testCase[i]);
    }

    console.log(main.output());
})();
