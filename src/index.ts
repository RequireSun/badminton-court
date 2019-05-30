const testCase = [
    'U002 2017-08-01 19:00~22:00 A',
    'U003 2017-08-01 18:00~20:00 A',
    'U002 2017-08-01 19:00~22:00 A C',
    'U002 2017-08-01 19:00~22:00 A C',
    'U003 2017-08-01 18:00~20:00 A',
    'U003 2017-08-02 13:00~17:00 B',
];

// {用户 ID} {预订日期 yyyy-MM-dd} {预订时间段 HH:mm~HH:mm} {场地}
// {用户 ID} {预订日期 yyyy-MM-dd} {预订时间段 HH:mm~HH:mm} {场地} {取消标记}
const regInput = /^(\w+)\s(\d{4}-\d{1,2}-\d{1,2})\s(\d{1,2}:\d{2})~(\d{1,2}:\d{2})\s(\w+)(?:\s(\w))?$/;
const regYMD = /^(\d{4})-(\d{1,2})-(\d{1,2})/;
const regTime = /^(\d{1,2}):(\d{2})^/;

const matchResult: Array<string | number> | null = testCase[0].match(regInput);

/**
 * 可以扩展下返回值, 返回具体哪一位不对
 * 复杂正则无法细到哪一项有问题, 而且也不好改
 * @param {string} strDate
 * @returns {boolean}
 */
function validationDate (strDate: string): boolean {
    const matchResult: Array<string | number> | null = strDate.match(regYMD);

    if (!matchResult) {
        return false;
    }

    // 方便后面转类型, 先不声明类型了
    let [, year, month, date] = matchResult;

    date = +date;
    // 怎么可能是 0 号
    if (0 >= date) {
        return false;
    }

    switch (month) {
        case '01': {
            return 31 >= date;
        }
        case '02': {
            year = +year;
            // 整百
            if (0 === year % 100) {
                // 400 才是闰年
                if (0 === year % 400) {
                    return 29 >= date;
                } else {
                    return 28 >= date;
                }
            } else {
                // 4 就是闰年
                if (0 === year % 4) {
                    return 29 >= date;
                } else {
                    return 28 >= date;
                }
            }
        }
        case '03':
        case '04':
        case '05':
        case '06':
        case '07':
        case '08':
        case '09':
        case '10':
        case '11':
        case '12': {
            month = (+month - 3) % 5;

            // 01 02 03 04 05 06 07 08 09 10 11 12
            // 31 28 31 30 31 30 31 31 30 31 30 31
            // 减 3 进行整体平移, 再对 5 余一下, 让月份重合
            //  0  1  2  3  4
            // 03 04 05 06 07
            // 08 09 10 11 12
            // 31 30 31 30 31
            // 现在是偶数的月份就是大月了
            if (0 === month % 2) {
                return 31 >= date;
            } else {
                return 30 >= date;
            }
        }
        default: {
            // 月份错了
            return false;
        }
    }
}

/**
 * 只判断时间是否合理, 不管是否营业, 是否营业在算钱的时候判断
 * @param {string} startTime
 * @param {string} endTime
 * @returns {boolean}
 */
function validationTime(startTime: string, endTime: string): boolean {
    const matchResultStartTime: Array<string | number> | null = startTime.match(regTime);
    const matchResultEndTime: Array<string | number> | null = endTime.match(regTime);

    if (!matchResultStartTime || !matchResultEndTime) {
        return false;
    }

    let [, startHour, startMinute] = matchResultStartTime;
    let [, endHour, endMinute] = matchResultEndTime;

    // 时间必须是整点
    if ('00' !== startMinute || '00' !== endMinute) {
        return false;
    }

    startHour = +startHour;
    endHour = +endHour;

    if (0 > startHour || 24 < startHour) {
        return false;
    }

    if (0 > endHour || 24 < endHour) {
        return false;
    }

    return startHour > endHour;
}

(function () {

    if (matchResult) {
        const [, userName, date, startTime, endTime, courtNo, isCancel] =
            matchResult as [any, string, string, string, string, string, string];

        if (!validationDate(date)) {
            // TODO
            console.error('日期炸了');
            return ;
        }

        if (!validationTime(startTime, endTime)) {
            console.error('时间炸了');
            return ;
        }
    }
})();

