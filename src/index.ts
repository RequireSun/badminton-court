import validationDate from './validation/date';
import validationTime from './validation/time';
import validationCancel from './validation/cancel';
import transformerDateStrToNum from './transformer/dateStrToNum';
import judgeIsFree from './judgement/isFree';
import judgeInBusiness from './judgement/inBusiness';

const testCase = [
    'U002 2017-08-01 19:00~22:00 A',
    'U003 2017-08-01 18:00~20:00 A',
    'U002 2017-08-01 19:00~22:00 A C',
    'U002 2017-08-01 19:00~22:00 A C',
    'U003 2017-08-01 18:00~20:00 A',
    'U003 2017-08-02 13:00~17:00 B',
];

const booked: IBooking[] = [];

function booking(userName: string, date: string, startTime: number, endTime: number, courtNo: string) {
    booked.push({
        userName,
        date,
        startTime,
        endTime,
        courtNo,
    });
}

function findBookingIndex(userName: string, date: string, startTime: number, endTime: number, courtNo: string): number {
    return booked.findIndex(
        (bookingItem: IBooking): boolean =>
            bookingItem.userName === userName &&
            bookingItem.date === date &&
            bookingItem.startTime === startTime &&
            bookingItem.endTime === endTime &&
            bookingItem.courtNo === courtNo,
    );
}
function cancellation(index: number) {
    booked.splice(index, 1);
}

function main(input: string) {
    const matchResult: Array<string | number> | null = input.match(regInput);

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

        const sameDaySameCourt: IBooking[] = booked.filter(
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
            const index = findBookingIndex(userName, date, numStartTime, numEndTime, courtNo);

            if (0 > index) {
                console.error('没有这个订单');
                return;
            }

            cancellation(index);

            console.log('取消成功', input);
        } else {
            const noIntersection = judgeIsFree(sameDaySameCourt, numStartTime, numEndTime);

            if (!noIntersection) {
                console.error('已被预定了');
                return;
            }

            booking(userName, date, numStartTime, numEndTime, courtNo);

            console.log('预订成功', input);
        }
    }
}

(() => {
    for (let i = 0, l = testCase.length; i < l; ++i) {
        main(testCase[i]);
    }

    // console.log('bookings', booked);
})();
