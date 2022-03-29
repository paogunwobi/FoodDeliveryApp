import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchBy'
})
export class SearchByPipe implements PipeTransform {

  transform(items: any, filter: any): any {
    if (!filter) {
      return items;
    }

    if (!Array.isArray(items)) {
      return items;
    }

    if (filter && Array.isArray(items)) {
      const filterKeys = Object.keys(filter);

      return items.filter(item => {
        return filterKeys.some((keyName): any => {
          if (item[keyName] && filter[keyName] instanceof Object && item[keyName] !== undefined && item[keyName] instanceof Object) {
            const nastedFilter = filter[keyName];

            if (nastedFilter) {
              const nastedFilterKeys = Object.keys(nastedFilter);

              return nastedFilterKeys.some((nastedKeyName) => {
                return new RegExp(this.removePlus(nastedFilter[nastedKeyName]), 'gi').test(item[keyName][nastedKeyName]) || this.removePlus(nastedFilter[nastedKeyName]) == '';
              });
            }
          } else if (item[keyName]) {
            return new RegExp(this.removePlus(filter[keyName]), 'gi').test(item[keyName]) || this.removePlus(filter[keyName]) == '';
          }
        });
      });
    }
  }

  removePlus(keyValue: string) {
    return keyValue.replace('+', '');
  }

}
