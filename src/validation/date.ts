import { regYMD } from '../constant/regexp';

/**
 * 可以扩展下返回值, 返回具体哪一位不对
 * 复杂正则无法细到哪一项有问题, 而且也不好改
 * @param {string} strDate
 * @returns {boolean}
 */
export default function validationDate(strDate: string): boolean {
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
