import dayjs from 'dayjs';

export const visibleDate = (date: string) => {
  const d = new Date(date);
  if (!d.getFullYear()) return <span>{date}</span>;

  return (
    <>
      {String(d.getMonth() + 1).padStart(2, '0')}
      <span>/</span>
      {d.getFullYear() % 100}
    </>
  );
};

export const a11yDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const getSecondFromTimeStamp = (_date: Date) => {
  return Math.floor(_date.getTime() / 1000);
};

export const getStartDateTimeByUnit = (currentDate: Date, unit: 'day' | 'month' | 'year') => {
  return dayjs(currentDate).startOf(unit).toDate();
};

export const getEndOfDateTimeByUnit = (currentDate: Date, unit: 'day' | 'month' | 'year') => {
  return dayjs(currentDate).endOf(unit).toDate();
};

export const getTimeWalkingDateByUnit = (
  currentDate: Date,
  unit: 'day' | 'month' | 'year',
  {
    step = 1,
    backOrForward = -1
  }: {
    step?: number;
    backOrForward?: -1 | 1;
  }
) => {
  const fnc = backOrForward === -1 ? 'subtract' : 'add';

  return dayjs(currentDate)[fnc](step, unit).toDate();
};
