export default function(bookingA: IBookingStatement, bookingB: IBookingStatement): number {
    const dateCmpResult = +new Date(bookingA.booking.date) - +new Date(bookingB.booking.date);

    if (0 !== dateCmpResult) {
        return dateCmpResult;
    }

    const startTimeCmp = bookingA.booking.startTime - bookingB.booking.startTime;

    if (0 !== startTimeCmp) {
        return startTimeCmp;
    }

    return bookingA.booking.endTime - bookingB.booking.endTime;
}
