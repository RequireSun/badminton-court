import validationDate from './validation/date';
import validationTime from './validation/time';
import validationCancel from './validation/cancel';
import transformerDateStrToNum from './transformer/dateStrToNum';
import judgeInBusiness from './judgement/inBusiness';
import judgeIsFree from './judgement/isFree';
import { regInput } from './constant/regexp';
import { HOUR } from './constant/time';
import sortFnDate from './util/sortFnDate';
import priceMap from './constant/priceMap';

export default class Main {
    private static calcCost(date: string, startTime: number, endTime: number, status: 'Booked' | 'Canceled'): number {
        let summary: number = 0;

        const dayOfWeek: number = new Date(date).getDay();
        const priceList: number[] = priceMap[dayOfWeek];

        // TODO 外面有校验, 我就当 start end 合理
        let hourNow = Math.floor(startTime / HOUR);
        const hourEnd = Math.floor(endTime / HOUR);

        while (hourNow < hourEnd) {
            // 如果对应位置的数字是 NaN, 就证明不能预订
            if (isNaN(priceList[hourNow])) {
                throw new Error('not open in this time');
            }
            summary += priceList[hourNow];
            ++hourNow;
        }

        return 'Canceled' === status ? summary / 2 : summary;
    }

    private booked: IBooking[] = [];
    private canceled: IBooking[] = [];

    public input(str: string): string | void {
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
                // console.error('日期炸了');
                return 'Error: the booking is invalid!';
            }

            if (!validationTime(startTime, endTime)) {
                // console.error('时间炸了');
                return 'Error: the booking is invalid!';
            }

            // 存在 cancel 标识, 且没通过校验
            if (undefined !== isCancel && !validationCancel(isCancel)) {
                // console.error('取消标识炸了');
                return 'Error: the booking is invalid!';
            }

            const sameDaySameCourt: IBooking[] = this.booked.filter(
                bookingItem => bookingItem.date === date && bookingItem.courtNo === courtNo,
            );
            const numStartTime: number = transformerDateStrToNum(startTime);
            const numEndTime: number = transformerDateStrToNum(endTime);

            const inBusiness = judgeInBusiness(date, numStartTime, numEndTime);

            if (!inBusiness) {
                // console.error('没有营业');
                return 'Error: the booking is invalid!';
            }

            if (isCancel) {
                const index = this.findBookingIndex(userName, date, numStartTime, numEndTime, courtNo);

                if (0 > index) {
                    // console.error('没有这个订单');
                    return 'Error: the booking being cancelled does not exist!';
                }

                this.cancellation(index);

                // console.log('取消成功', str);

                return;
            } else {
                const noIntersection = judgeIsFree(sameDaySameCourt, numStartTime, numEndTime);

                if (!noIntersection) {
                    // console.error('已被预定了');
                    return 'Error: the booking conflicts with existing bookings!';
                }

                this.booking(userName, date, numStartTime, numEndTime, courtNo);

                // console.log('预订成功', str);

                return;
            }
        } else {
            return 'Error: the booking is invalid!';
        }
    }

    public output() {
        const summary: { [courtNo: string]: { bookings: IBookingStatement[]; price: number } } = {};

        for (let i = 0, l = this.booked.length; i < l; ++i) {
            if (!summary[this.booked[i].courtNo]) {
                summary[this.booked[i].courtNo] = { bookings: [], price: 0 };
            }

            summary[this.booked[i].courtNo].bookings.push({ booking: this.booked[i], price: 0 });
        }

        for (let i = 0, l = this.canceled.length; i < l; ++i) {
            if (!summary[this.canceled[i].courtNo]) {
                summary[this.canceled[i].courtNo] = { bookings: [], price: 0 };
            }

            summary[this.canceled[i].courtNo].bookings.push({ booking: this.canceled[i], price: 0 });
        }

        for (const courtNo of Object.keys(summary)) {
            summary[courtNo].bookings.sort(sortFnDate);

            let price = 0;

            for (const bookingItem of summary[courtNo].bookings) {
                bookingItem.price = Main.calcCost(
                    bookingItem.booking.date,
                    bookingItem.booking.startTime,
                    bookingItem.booking.endTime,
                    bookingItem.booking.status,
                );

                price += bookingItem.price;
            }

            summary[courtNo].price = price;
        }

        return summary;
    }

    private booking(userName: string, date: string, startTime: number, endTime: number, courtNo: string) {
        this.booked.push({
            userName,
            date,
            startTime,
            endTime,
            courtNo,
            status: 'Booked',
        });
    }

    private findBookingIndex(
        userName: string,
        date: string,
        startTime: number,
        endTime: number,
        courtNo: string,
    ): number {
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
        const bookingItem = this.booked.splice(index, 1);

        for (let i = 0, l = bookingItem.length; i < l; ++i) {
            bookingItem[i].status = 'Canceled';
        }

        this.canceled.push(...bookingItem);
    }
}
