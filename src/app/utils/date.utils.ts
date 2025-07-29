// src/app/utils/date.utils.ts
export const formatDate = (date: Date, hasDay=true, hasYear=true, hasMonth=true) => {
  return new Intl.DateTimeFormat('en-US', {
    year: hasYear ? 'numeric' : undefined,
    month: hasMonth ? 'long' : undefined,
    day: hasDay ? 'numeric' : undefined,
  }).format(date);
};
