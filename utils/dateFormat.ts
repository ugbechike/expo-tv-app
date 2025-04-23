import { format } from 'date-fns';

export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  // just return the year example 2020
  return dateObj.getFullYear();
  // return format(dateObj, 'yyyy');

};