
// {用户 ID} {预订日期 yyyy-MM-dd} {预订时间段 HH:mm~HH:mm} {场地}
// {用户 ID} {预订日期 yyyy-MM-dd} {预订时间段 HH:mm~HH:mm} {场地} {取消标记}
export const regInput = /^(\w+)\s(\d{4}-\d{1,2}-\d{1,2})\s(\d{1,2}:\d{2})~(\d{1,2}:\d{2})\s(\w+)(?:\s(\w))?$/;
export const regYMD = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
export const regTime = /^(\d{1,2}):(\d{2})$/;
