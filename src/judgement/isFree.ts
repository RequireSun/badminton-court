
export default function judgeIsFree(sameBooked: IBooking[], startTime: number, endTime: number): boolean {
    for (let i = 0, l = sameBooked.length; i < l; ++i) {
        // 当前的时间比已预定的结束时间早, 或者结束比已预订的晚, 证明重合了
        if (startTime < sameBooked[i].endTime || endTime > sameBooked[i].startTime) {
            return false;
        }
    }

    return true;
}
