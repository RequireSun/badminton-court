export default function padZero (str: string, totalLength: number) {
    const lacks = totalLength - str.length;

    if (0 > lacks) {
        return str;
    }

    return `${'0'.repeat(lacks)}${str}`;
}
