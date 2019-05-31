import validationDate from './validation/date';
import validationTime from './validation/time';
import validationCancel from './validation/cancel';
import transformerDateStrToNum from './transformer/dateStrToNum';
import judgeInBusiness from './judgement/inBusiness';
import judgeIsFree from './judgement/isFree';
import { regInput } from './constant/regexp';

export default class Main {
    private booked: IBooking[] = [];

    public input (str: string) {
        const matchResult: Array<string | number> | null = str.match(regInput);

        if (matchResult) {
            const [, userName, date, startTime, endTime, courtNo, isCancel] = matchResult as [
                any,
                string,
                string,
                string,
                string,
                string,
                string
                ];

            if (!validationDate(date)) {
                // TODO
                console.error('日期炸了');
                return;
            }

            if (!validationTime(startTime, endTime)) {
                console.error('时间炸了');
                return;
            }

            // 存在 cancel 标识, 且没通过校验
            if (undefined !== isCancel && !validationCancel(isCancel)) {
                console.error('取消标识炸了');
                return;
            }

            const sameDaySameCourt: IBooking[] = this.booked.filter(
                bookingItem => bookingItem.date === date && bookingItem.courtNo === courtNo,
            );
            const numStartTime: number = transformerDateStrToNum(startTime);
            const numEndTime: number = transformerDateStrToNum(endTime);

            const inBusiness = judgeInBusiness(date, numStartTime, numEndTime);

            if (!inBusiness) {
                console.error('没有营业');
                return;
            }

            if (isCancel) {
                const index = this.findBookingIndex(userName, date, numStartTime, numEndTime, courtNo);

                if (0 > index) {
                    console.error('没有这个订单');
                    return;
                }

                this.cancellation(index);

                console.log('取消成功', str);
            } else {
                const noIntersection = judgeIsFree(sameDaySameCourt, numStartTime, numEndTime);

                if (!noIntersection) {
                    console.error('已被预定了');
                    return;
                }

                this.booking(userName, date, numStartTime, numEndTime, courtNo);

                console.log('预订成功', str);
            }
        }
    }

    private booking(userName: string, date: string, startTime: number, endTime: number, courtNo: string) {
        this.booked.push({
            userName,
            date,
            startTime,
            endTime,
            courtNo,
        });
    }

    private findBookingIndex(userName: string, date: string, startTime: number, endTime: number, courtNo: string): number {
        return this.booked.findIndex(
            (bookingItem: IBooking): boolean =>
                bookingItem.userName === userName &&
                bookingItem.date === date &&
                bookingItem.startTime === startTime &&
                bookingItem.endTime === endTime &&
                bookingItem.courtNo === courtNo,
        );
    }

    private cancellation(index: number) {
        this.booked.splice(index, 1);
    }
}
