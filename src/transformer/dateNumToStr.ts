import { HOUR, MINUTE } from '../constant/time';
import padZero from './padZero';

export default function dateStrToNum(date: number): string {
    const hour = `${Math.floor((date / HOUR) % 24)}`;
    const minute = `${Math.floor((date % HOUR) / MINUTE)}`;

    return `${padZero(hour, 2)}:${padZero(minute, 2)}`;
}
