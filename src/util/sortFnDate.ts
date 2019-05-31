export default function (bookingA: IBooking, bookingB: IBooking): number {
    const dateCmpResult = +(new Date(bookingA.date)) - +(new Date(bookingB.date));

    if (0 !== dateCmpResult) {
        return dateCmpResult;
    }

    const startTimeCmp = bookingA.startTime - bookingB.startTime;

    if (0 !== startTimeCmp) {
        return startTimeCmp;
    }

    return bookingA.endTime - bookingB.endTime;
}
