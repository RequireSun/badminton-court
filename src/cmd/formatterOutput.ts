import dateNumToStr from '../transformer/dateNumToStr';

export default function(bookingStatement: {
    [courtNo: string]: { bookings: IBookingStatement[]; price: number };
}): string[] {
    const courtNos: string[] = Object.keys(bookingStatement).sort();
    const lines: string[] = ['收入汇总', '---'];
    let summary: number = 0;

    for (const courtNo of courtNos) {
        lines.push(`场地:${courtNo}`);

        for (const booking of bookingStatement[courtNo].bookings) {
            lines.push(
                `${booking.booking.date} ${dateNumToStr(booking.booking.startTime)}~${dateNumToStr(
                    booking.booking.endTime,
                )}${'Canceled' === booking.booking.status ? ' 违约金' : ''} ${booking.price} 元`,
            );
        }

        lines.push(`小计: ${bookingStatement[courtNo].price} 元`);
        lines.push('');
        summary += bookingStatement[courtNo].price;
    }
    // 把那个多余的空行排出来
    lines.pop();

    lines.push('---', `总计: ${summary} 元`);

    return lines;
}
