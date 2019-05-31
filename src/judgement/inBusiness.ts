import priceMap from '../constant/priceMap';
import { HOUR } from '../constant/time';

export default function judgeInBusiness(date: string, startTime: number, endTime: number): boolean {
    const dayOfWeek: number = new Date(date).getDay();
    const priceList: number[] = priceMap[dayOfWeek];

    // TODO 外面有校验, 我就当 start end 合理
    let hourNow = Math.floor(startTime / HOUR);
    const hourEnd = Math.floor(endTime / HOUR);

    while (hourNow < hourEnd) {
        // 如果对应位置的数字是 NaN, 就证明不能预订
        if (isNaN(priceList[hourNow])) {
            return false;
        }
        ++hourNow;
    }

    return true;
}
