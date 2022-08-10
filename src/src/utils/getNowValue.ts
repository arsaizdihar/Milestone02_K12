import dayjs from 'dayjs';

export function getNowValue() {
  let date = dayjs();
  date = date.set('date', date.date() + 1);
  return date.format('YYYY-MM-DDTHH:00');
}
