export default function judgeIsFree(sameBooked: IBooking[], startTime: number, endTime: number): boolean {
    for (let i = 0, l = sameBooked.length; i < l; ++i) {
        if (startTime < sameBooked[i].startTime && endTime < sameBooked[i].startTime) {
            // 在之前
            // continue;
        } else if (startTime > sameBooked[i].endTime && endTime > sameBooked[i].endTime) {
            // 在之后
            // continue;
        } else {
            return false;
        }
    }

    return true;
}
