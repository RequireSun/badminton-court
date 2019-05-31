
interface IBooking {
    userName: string;
    /**
     * 反正不能通宵定, 这玩意跟 ID 没什么区别
     */
    date: string;
    /**
     * 就怕以后会要求支持分钟, 所以不敢写整数
     */
    startTime: number;
    endTime: number;
    courtNo: string;
}
