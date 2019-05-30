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
const regYMD = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
const regTime = /^(\d{1,2}):(\d{2})$/;

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

    // 这个时间必须要合理, 开始小于结束
    return startHour < endHour;
}

function validationCancel(isCancel: string): boolean {
    return 'C' === isCancel;
}

interface IBooking {
    userName: string;
    /**
     * 反正不能通宵定, 这玩意跟 ID 没什么区别
     */
    date: string;
    /**
     * 就怕以后会要求支持分钟, 所以不敢写整数
     */
    startTime: number;
    endTime: number;
    courtNo: string;
}

const booked: IBooking[] = [];

/**
 * 第一维: 日
 * 第二维: 小时, 起点 0, 终点 24
 */
const priceMap: Array<Array<number>> = [
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 30, 30, 30, 50, 50, 50, 50, 50, 50, 80, 80, 60, 60, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 30, 30, 30, 50, 50, 50, 50, 50, 50, 80, 80, 60, 60, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 30, 30, 30, 50, 50, 50, 50, 50, 50, 80, 80, 60, 60, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 30, 30, 30, 50, 50, 50, 50, 50, 50, 80, 80, 60, 60, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 30, 30, 30, 50, 50, 50, 50, 50, 50, 80, 80, 60, 60, NaN, NaN],
    [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 40, 40, 40, 50, 50, 50, 50, 50, 50, 60, 60, 60, 60, NaN, NaN],
];

/**
 * 一小时相当于 3600000 毫秒
 */
const HOUR = 1000 * 60 * 60;

function dateStrToNum(date: string): number {
    const matchResult: Array<string | number> | null = date.match(regTime);

    if (!matchResult) {
        throw Error('input schema incorrect!');
    }

    // (小时 * 60 + 分钟) * 60 * 1000 转换成毫秒
    return (+matchResult[1] * 60 + +matchResult[2]) * 60 * 1000;
}

function judgeIsFree(booked: IBooking[], startTime: number, endTime: number): boolean {
    for (let i = 0, l = booked.length; i < l; ++i) {
        // 当前的时间比已预定的结束时间早, 或者结束比已预订的晚, 证明重合了
        if (startTime < booked[i].endTime || endTime > booked[i].startTime) {
            return false;
        }
    }

    return true;
}

function judgeInBusiness(date: string, startTime: number, endTime: number): boolean {
    const dayOfWeek: number = (new Date(date)).getDay();
    const priceList: number[] = priceMap[dayOfWeek];

    // TODO 外面有校验, 我就当 start end 合理
    let hourNow = Math.floor(startTime / HOUR);
    let hourEnd = Math.floor(endTime / HOUR);

    while (hourNow < hourEnd) {
        // 如果对应位置的数字是 NaN, 就证明不能预订
        if (isNaN(priceList[hourNow])) {
            return false;
        }
        ++hourNow;
    }

    return true;
}

function booking(userName: string, date: string, startTime: number, endTime: number, courtNo: string) {
    booked.push({
        userName: userName,
        date,
        startTime,
        endTime,
        courtNo,
    });
}

function cancellation(userName: string, date: string, startTime: string, endTime: string, courNo: string) {

}

function main(input: string) {
    const matchResult: Array<string | number> | null = input.match(regInput);

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

        // 存在 cancel 标识, 且没通过校验
        if (undefined !== isCancel && !validationCancel(isCancel)) {
            console.error('取消标识炸了');
            return ;
        }

        const sameDaySameCourt: IBooking[] = booked.filter(booking => booking.date === date && booking.courtNo === courtNo);
        const numStartTime: number = dateStrToNum(startTime);
        const numEndTime: number = dateStrToNum(endTime);

        const inBusiness = judgeInBusiness(date, numStartTime, numEndTime);

        if (!inBusiness) {
            console.error('没有营业');
            return ;
        }

        if (isCancel) {

        } else {
            const noIntersection = judgeIsFree(sameDaySameCourt, numStartTime, numEndTime);

            if (!noIntersection) {
                console.error('已被预定了');
                return ;
            }

            booking(userName, date, numStartTime, numEndTime, courtNo);
        }
    }

}

(function () {
    for (let i = 0, l = testCase.length; i < l; ++i) {
        main(testCase[i]);
    }

    console.log('bookings', booked);
})();

