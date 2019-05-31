import { regTime } from '../constant/regexp';

/**
 * 只判断时间是否合理, 不管是否营业, 是否营业在算钱的时候判断
 * @param {string} startTime
 * @param {string} endTime
 * @returns {boolean}
 */
export default function validationTime(startTime: string, endTime: string): boolean {
    const matchResultStartTime: Array<string | number> | null = startTime.match(regTime);
    const matchResultEndTime: Array<string | number> | null = endTime.match(regTime);

    if (!matchResultStartTime || !matchResultEndTime) {
        return false;
    }

    // tslint:disable-next-line prefer-const
    let [, startHour, startMinute] = matchResultStartTime;
    // tslint:disable-next-line prefer-const
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
