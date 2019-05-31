import { regTime } from '../constant/regexp';

export default function dateStrToNum(date: string): number {
    const matchResult: Array<string | number> | null = date.match(regTime);

    if (!matchResult) {
        throw Error('input schema incorrect!');
    }

    // (小时 * 60 + 分钟) * 60 * 1000 转换成毫秒
    return (+matchResult[1] * 60 + +matchResult[2]) * 60 * 1000;
}
