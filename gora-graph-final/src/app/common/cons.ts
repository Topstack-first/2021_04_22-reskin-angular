import {formatDate} from '@angular/common';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {NativeDateAdapter} from '@angular/material/core';
import {Injectable} from '@angular/core';


export const MIN_TIME = '00:00:00.000000';
export const MAX_TIME = '23:59:59.999999';

@Injectable()
export class DateFormat extends NativeDateAdapter {
  useUtcForDisplay = true;

  getFirstDayOfWeek(): number {
    return 1;
  }

  parse(value: any): any | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}

export function buildQueryString(paginator: MatPaginator, sort: MatSort, filter: any): string {
  const queryString = [];
  // tslint:disable-next-line:variable-name
  const page_size: number = paginator.pageSize ? paginator.pageSize : 10;
  let page: number = paginator.pageIndex ? paginator.pageIndex : 0;
  page++;  // mat-paginator starts indexing from zero

  if (page) {
    queryString.push(`page=${page}`);
  }
  if (page_size) {
    queryString.push(`page_size=${page_size}`);
  }
  if (sort) {
    const ordering = sort ? getSort(sort.active, sort.direction) : '-id';
    queryString.push(`ordering=${ordering}`);
  }
  if (filter) {
    queryString.push(buildFilterString(filter));
  }
  if (queryString.length > 0) {
    return '?' + queryString.join('&');
  }
  return '';
}

// tslint:disable-next-line:variable-name
function buildFilterString(_filter: { [key: string]: any }): any {
  const filter = {..._filter};
  let filterString = '';
  Object.keys(filter).forEach((key) => {
    let value = filter[key];
    if (value) {
      if (value instanceof Date) {
        value = reformatDate(key, value);
      }
      filterString += `${key}=${value}&`;
    }
  });
  return filterString;
}

// tslint:disable-next-line:variable-name
function reformatDate(field_name: string, date: Date): string {
  if (field_name.includes('_before')) {
    return formatDateToString(date, MAX_TIME);
  } else if (field_name.includes('_after')) {
    return formatDateToString(date, MIN_TIME);
  } else {
    return formatDateToString(date);
  }
}

export function formatDateToString(date: Date | string, time: string = ''): string {
  if (typeof date === 'object') {
    let formattedDate: string = formatDate(date, 'yyyy-MM-dd', 'en-us');
    if (time) {
      formattedDate += `+${time}`;
    }
    return formattedDate;
  }
  return date;
}


/**
 * Convert Mat Sort Header Direction to required sign for backend.
 * @param active:         Field name
 * @param direction:      Mat Sort Direction
 * @return sort:          '-' if directions is desc and '' otherwise
 */
export function getSort(active: string, direction: 'asc' | 'desc' | ''): any {
  const sort = direction === 'desc' ? '-' : '';
  return sort + active;
}
